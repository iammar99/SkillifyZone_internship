import React, { useState } from 'react'
import img from "../../Assets/heroImage.png"

export default function BottomNav() {




    return (
        <>
            <div className="bottom-nav">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col d-flex justify-content-center">
                            <div className="d-flex flex-column  hero-content">
                                <h1 className="text-center text-light">
                                    Plan Moments That Matter
                                </h1>
                                <h3 className="text-center text-light" style={{ "fontWeight": "300" }}>
                                    Eventora helps you organize unforgettable events with ease, from birthdays to business meetups
                                </h3>
                                <img className='hero-img' src={img} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="stats-container">
                <div className="container" style={{ "height": "-webkit-fill-available" }}>
                    <div className="row" style={{ "height": "-webkit-fill-available" }}>
                        <div className="d-flex justify-content-center col col-6 col-md-4 text-center text-light" style={{ 'background': "#333f4c", "color": "white" }}>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="icon" style={{ "background": "white", "color": "#333f4c" }}>
                                    <i className='fa-solid fa-users'></i>
                                </div>
                                <div className="text">
                                    <h3 style={{ "fontSize": "20px" }}>
                                        Happy Clients
                                    </h3>
                                    <div className="number">
                                        16534
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center col col-6 col-md-4 text-center text-light border-start" style={{ 'background': "white", "color": "#333f4c" }}>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="icon" style={{ "background": "#333f4c", "color": "white" }}>
                                    <i className="fa-solid fa-calendar-check"></i>
                                </div>
                                <div className="text" style={{ "color": "#333f4c" }}>
                                    <h3 style={{ "fontSize": "20px" }}>
                                        Events managed
                                    </h3>
                                    <div className="number" style={{ "color": "#333f4c" }}>
                                        1,236
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center col col-12 col-md-4 text-center border-start" style={{ 'background': "#333f4c", "color": "white" }}>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="icon" style={{ "background": "white", "color": "#333f4c" }}>
                                    <i className="fa-solid fa-hourglass-start"></i>
                                </div>
                                <div className="text">
                                    <h3 style={{ "fontSize": "20px" }}>
                                        Years of Experience
                                    </h3>
                                    <div className="number" >
                                        14
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
