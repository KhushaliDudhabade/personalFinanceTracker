import React from 'react'
import Header from '../Components/Header'
import SigninSignup from '../Components/SigninSignup'

function SignupPage() {
  return (
    <div><Header/>
      <div className='wrapper'>
      <SigninSignup/>
    </div>
      </div>
  )
}

export default SignupPage