import React from 'react'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'
import Header from 'Components/Header'
import Footer from 'Components/Footer'
import Men from './Men'
import Women from './Women'
import Kid from './Kid'
import ProductDetail from './ProductDetail'

export default function Frontend() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/men' element={<Men/>}/>
                <Route path='/women' element={<Women/>}/>
                <Route path='/kid' element={<Kid/>}/>
                <Route path='/products-detail' element={<ProductDetail/>}/>
            </Routes>
            <Footer />
        </>
    )
}
