import React from 'react'
import cardImg from './cardImage.jpg'

function NoTransaction() {
  return (
    <div style={{display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        flexDirection:"column",
        marginBottom:"2rem",
        borderRadius:"50%",
    }}>
        <img src={cardImg} alt="" style={{width:"400px",margin:"4rem",borderRadius:"50%",}}></img>
        <p style={{textAlign:"center",fontSize:"1.2rem"}}>You have no transaction currently</p>
    </div>
  )
}

export default NoTransaction