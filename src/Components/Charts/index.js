import React from 'react'
import { Line, Pie } from '@ant-design/charts';


function Charts({sortedTransaction}) {
  const data = sortedTransaction.map((item)=>{
    return {date:item.date, amount:item.amount}
  });

  const spendingData= sortedTransaction.filter((transaction)=>{if(transaction.type==="expense"){
     return {tag:transaction.tag, amount:transaction.amount}
  }});

  const config = {
    data:data,
    width: 500,
    height: 400,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
    
  };

  let finalSpendings=spendingData.reduce((acc,obj)=>{
    let key=obj.tag;
    if(!acc[key]){
      acc[key]={tag:obj.tag,amount:obj.amount};
    }else{
      acc[key].amount+=obj.amount;
    }
    return acc;
  },{});

  const spendingConfig={
    data:Object.values(finalSpendings),
    width:500,
    height: 400,
    angleField:"amount",
    colorField:"tag",
  }
  let chart;
  let pieChart;
  return (
    <div className='charts'>
      <div className='linechart'>
        <h2>Your Analytics</h2>
        <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
      </div>

      <div className='piechart'>
        <h2>Your Spendings</h2>
        <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
      </div>
        
    </div>
  )
}

export default Charts