import React, { useState } from 'react'
import './style.css'
import { Radio, Select, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import searchIcon from './search.jpg'
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';

function TransactionTable({transaction,addTransaction,fetchTransactions}) {
    const[search,setSearch]=useState("");
    const[sortKey,setSortKey]=useState("");
    const[typeFilter,setTypeFilter]=useState("");


    const columns=[
        { 
        title:"Name",
         dataIndex:"name",
         key:"name",
         },
         { 
            title:"Amount",
             dataIndex:"amount",
             key:"amount",
        },
        { 
            title:"Tag",
             dataIndex:"tag",
             key:"tag",
        },
        { 
            title:"Type",
             dataIndex:"type",
             key:"type",
        },
        { 
            title:"Date",
             dataIndex:"date",
             key:"date",
        },    
     ];

     let filteredTransactions=transaction.filter((item)=>
        item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter))
     const sortedTransactions=[...filteredTransactions].sort((a,b)=>{
      if(sortKey==="date"){
        return new Date(a.date)- new Date(b.date);
      }else if(sortKey==="amount"){
        return a.amount-b.amount;
      }else{
        return 0;
      }
    });

    function exportCsv(){
      const csv = unparse({
        fields: ["name", "type","tag","date","amount"],
        data:transaction,
      })
      var data=new Blob([csv],{type:"text/csv;charset=utf-8;"});
      var csvURL=window.URL.createObjectURL(data);
      const tempLink= document.createElement("a");
      tempLink.href=csvURL;
      tempLink.setAttribute("download","transactions.csv");
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }

    function importFromCsv(event){
      event.preventDefault();
      try{
        parse(event.target.files[0],{
          header:true,
          complete:async function(results){
            console.log("Result--",results)
            for(const transaction of results.data){
              console.log("Transactions",transaction);
            const newTransaction={
              ...transaction,
              amount:parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction,true);
            }
          },
        })
        toast.success("All Transaction Added");
        fetchTransactions();
        event.target.files=null;
      }catch(e){
        toast.error(e.message);
      }
    }
  return (
    <div style={{width:"100%"}}>
    <div className='container'>

    <div className='input-flex'>
    <img height="32" width="32" src={searchIcon} alt=""></img>
    <input value={search}  onChange={(e) => setSearch(e.target.value)} placeholder='Search by Name'/>
    </div>
    <Select
    className="select-input"
    onChange={(value)=>setTypeFilter(value)}
    value={typeFilter}
    placeholder="Filter"
    allowClear>
      <Option value="">All</Option>
      <Option value="income">Income</Option>
      <Option value="expense">Expense</Option>
    </Select>
    </div>

  <div className='my-table'>
    {/* sorting */}
    <div className='sort-div'>
    <h2>My Transaction </h2>
    <Radio.Group className='input-radio'
    onChange={(e)=>setSortKey(e.target.value)}
    value={sortKey}>
      <Radio.Button value="">No sort</Radio.Button>
      <Radio.Button value="date">Sort by Date</Radio.Button>
      <Radio.Button value="amount">Sort by Amount</Radio.Button>
    </Radio.Group>
    <div className='btn-container'>
     <button className='btn btn-blue' onClick={exportCsv}>Export to csv</button>
     <label for="file-csv" className='btn btn-blue'>Import from csv</label>
     <input id="file-csv" type='file' accept='.csv' style={{display:"none"}} onChange={importFromCsv}></input>
    </div>
    </div>
    
    <Table dataSource={sortedTransactions} columns={columns}></Table>
    </div>
    </div>
    
  )
}

export default TransactionTable