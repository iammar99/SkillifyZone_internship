import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from './Admin'
import Footer from 'Components/Footer'
import TopNav from 'Components/Header/TopNav'
import MyEvents from './MyEvents'
import Profile from './Profile'
import Cart from './Cart'
import Checkout from './Checkout'

export default function Dashboard() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path='/admin' element={<Admin />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/my-events' element={<MyEvents />} />
      </Routes>
      <Footer />
    </>
  )
}
