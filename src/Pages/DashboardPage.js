import React, { useState } from 'react'
import Header from '../Components/Header'
import Cards from '../Components/Cards'
import AddExpense from '../Components/Modals/AddExpense';
import AddIncome from '../Components/Modals/AddIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { db , auth} from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import TransactionTable from '../Components/TransactionTable';
import NoTransaction from '../Components/NoTransaction';
import Charts from '../Components/Charts';


function DashboardPage() {
//   const transactions=[{
//     type:"income",
//     amount:1200,
//     tag:"salary",
//     name:"income 1",
//     date:"2024-09-10"
//   },
//   {
//     type:"expense",
//     amount:1100,
//     tag:"food",
//     name:"expense",
//     date:"2024-09-12"
//   },
// ]
  const[transaction,setTransaction]=useState([]);
  const[loading,setLoading]=useState(false);
  const[user]=useAuthState(auth)
  const[isExpenseModalVisible, setIsExpenseModalVisible]=useState(false);
  const[isIncomeModalVisible, setIsIncomeModalVisible]=useState(false);
  const[income,setIncome]=useState(0);
  const[expense,setExpense]=useState(0);
  const[balance,setBalance]=useState(0);

  const showExpenseModal=()=>{
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal=()=>{
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel=()=>{
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel=()=>{
    setIsIncomeModalVisible(false);
  };
  
  const onFinish = (values, type) => {
    console.log("Form Values:", values);
    const newTransaction = {
      type: type,
      date: values.date.format('YYYY-MM-DD'), 
      amount: parseFloat(values.amount), 
      tag: values.tag, 
      name: values.name,
    };
    addTransaction(newTransaction);
  };
  

  async function addTransaction(transaction,many,fetchTransactions) {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Add the transaction to Firebase
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`), 
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction added successfully!");
  
      // Update the state by adding the new transaction to the existing transactions array
      setTransaction((prevTransactions) => [...prevTransactions, transaction]);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Error adding transaction");
    }
  }
  

useEffect(()=>{
//get all doc from collection firebase
fetchTransactions();
},[user])

async function fetchTransactions(){
  setLoading(true)
  if(user){
    const q=query(collection(db,`users/${user.uid}/transactions`));
    const querySnapshot=await getDocs(q);
    let transactionsArray=[];
    querySnapshot.forEach((doc)=>{
      transactionsArray.push(doc.data());
    });
    setTransaction(transactionsArray);
    console.log("transaction array",transactionsArray)
    toast.success("Transaction Fetched");
  }
  setLoading(false)
}
useEffect(()=>{
  calculateBalance();
},[transaction])

function calculateBalance(){
   let incomeTotal=0;
   let expenseTotal=0;
   transaction.forEach((transaction)=>{
    if(transaction.type==="income"){
      incomeTotal+=transaction.amount;
    }else{
      expenseTotal+=transaction.amount;
    }
   });
   setIncome(incomeTotal);
   setExpense(expenseTotal);
   setBalance(incomeTotal-expenseTotal);
}

let sortedTransaction=transaction.sort((a,b)=>{
  return new Date(a.date)-new Date(b.date);
})
  
  return (
    <div>
      <Header/>
      {loading?<p>Loading...</p>:<>
      <Cards 
      income={income}
      expense={expense}
      balance={balance}
      showExpenseModal={showExpenseModal} 
      showIncomeModal={showIncomeModal}/>
      {transaction && transaction.length!=0?<Charts sortedTransaction={sortedTransaction}/>:<NoTransaction/>}
      <AddExpense
       isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel} 
        onFinish={(values) => onFinish(values, 'expense')}/>
      
      <AddIncome
       isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel} 
        onFinish={onFinish}/>
      </>}
      <TransactionTable transaction={transaction} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
    </div>
  )
}

export default DashboardPage