import React, { useState } from 'react'
import logo from "../../Assets/logo.png"
import { Link } from 'react-router-dom'
import { useAuthContext } from 'Context/AuthContext'
import { message } from 'antd'

export default function TopNav() {

  const { isAuth, setIsAuth, user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)


  const handleLogout = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const response = await fetch("http://localhost:8000/logout", {
      method: "GET",
      credentials: "include"
    })
    const result = await response.json()
    if (result.success) {
      message.success(result.message)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      setIsAuth(false)
    }
    else {
      message.error(result.message)
    }
    setIsLoading(false)
  }


  return (
    <>
      <nav className="navbar navbar-expand-lg " style={{ "background": "#d6e2f5" }}>
        <div className="container-fluid">
          <Link className="navbar-brand" href="#" >
            <img src={logo} alt="" style={{ "width": "70px" }} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to={"/"}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to={"/dashboard/my-events"}>
                  My Events
                </Link>
              </li>
              {
                user.role == "admin"
                  ?

                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to={"/dashboard/admin"}>
                      Dashboard
                    </Link>
                  </li>
                  :
                  <></>
              }
            </ul>
            {
              !isAuth
                ?
                <Link className="btn btn-outline-success" to={'/auth/'} >
                  Login
                </Link>
                :
                <button className="btn btn-outline-danger" onClick={handleLogout} >
                  {
                    isLoading
                      ?
                      <div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>

                      :
                      "Logout"
                  }
                </button>
            }
          </div>
        </div>
      </nav>

    </>
  )
}
