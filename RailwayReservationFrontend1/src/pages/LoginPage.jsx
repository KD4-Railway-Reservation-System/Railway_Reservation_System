import React, { useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()


  async function handOnclick(e) {
    e.preventDefault()
    const res = await axios.post('url', {
      "email": email,
      "password": password
    })
    if (res.data.success) {
      navigate("/")
    }
    setError(res.data.message)
  }


  return <div>
    <form onSubmit={handOnclick} method="post">
      <div>
        <label htmlFor="">email</label>
        <input type="email" placeholder="enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="">password</label>
        <input type="password" placeholder="enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button type="submit" >submit</button>
      </div>
    </form>
    <div className="">{error}</div>
  </div>
}
