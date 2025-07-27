import { useAuthContext } from 'Context/AuthContext'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { message } from 'antd'

export default function Login() {

  // -------------- Auth context --------------
  const { isAuth, setIsAuth, user, setUser } = useAuthContext()


  // -------------- State --------------
  const [state, setState] = useState({})
  const [isLoading, setIsLoading] = useState(false)


  // -------------- Handle Change --------------
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  // -------------- Handle Login --------------
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { email, password } = state
    if (!email || !password) {
      message.error("Please Fill all inputs")
      return
    }
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(state)
    })

    const result = await response.json()
    if (result.success) {
      message.success(result.message)

      const userData = {
        email: email,
        username: result.user.username,
        id: result.user._id,
        role:result.user.role
      }

      setIsAuth(true)
      setUser(userData)
      
      localStorage.setItem("token", "true")
      localStorage.setItem("user", JSON.stringify(userData))
    }
    
    else {
      message.error(result.message)
    }
    setIsLoading(false)
  }
  return (
    <main className='form-body'>
      <h1 className="text-center text-light mt-5 mb-0" style={{ "fontSize": "70px", "fontWeight": "800" }}>
        Login
      </h1>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            name='email'
            onChange={handleChange}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            name='password'
            onChange={handleChange}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div className="d-flex justify-content-between align-items-md-center align-items-baseline flex-md-row flex-column">
          <button type="submit" className="form-btn login-btn" onClick={handleLogin}>
            {
              !isLoading
                ?
                "Login"
                :
                <div className="spinner-grow" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
            }
          </button>
          <Link to={"/auth/register"}>
            Not have an Account ! Register
          </Link>
        </div>
      </form>

    </main>
  )
}
