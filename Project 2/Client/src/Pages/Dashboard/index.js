import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from './Admin'
import Header from 'Components/Header'
import Footer from 'Components/Footer'
import CreateEvent from './CreateEvent'
import TopNav from 'Components/Header/TopNav'
import MyEvents from './MyEvents'

export default function Dashboard() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path='/admin' element={<Admin />} />
        <Route path='/create-event' element={<CreateEvent />} />
        <Route path='/my-events' element={<MyEvents />} />
      </Routes>
      <Footer />
    </>
  )
}
