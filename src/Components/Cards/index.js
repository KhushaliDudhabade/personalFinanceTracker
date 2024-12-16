import React from 'react'
import './style.css'
import { Button, Card, Row } from 'antd'
import ButtonComponent from '../Button'

function Cards({income,expense,balance,showExpenseModal,showIncomeModal}) {
  return (
    <div>
        <Row className="my-row">
            <Card className="my-card" title="Current Balance">
            <p>${balance}</p>
            <ButtonComponent text="Reset Balance" blue={true}/>
            </Card>

            <Card className="my-card" title="Total Income">
            <p>${income}</p>
            <ButtonComponent text="Add Income" blue={true} onClick={showIncomeModal}/>
            </Card>

            <Card className="my-card" title="Total Expenses">
            <p>${expense}</p>
            <ButtonComponent text="Add Expenses" blue={true} onClick={showExpenseModal}/>
            </Card>

        </Row>
    </div>
  )
}

export default Cards