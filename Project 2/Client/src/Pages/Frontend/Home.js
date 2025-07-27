import { useAuthContext } from 'Context/AuthContext'
import React from 'react'
import { Link } from 'react-router-dom'
import img from "../../Assets/about-us.jpeg"
import more_about from "../../Assets/more.jpeg"

export default function Home() {

  const { isAuth } = useAuthContext()


  return (
    <main>
      {/* About Section  */}
      <section id="about" className="about">
        <div className="container">
          <div className="row">
            <h1 className="text-center about-heading my-4">
              About US
            </h1>
            <div className="col-12 col-md-6">
              <p className='about-text'>
                Eventora is your all-in-one solution for effortless event planning and management. Whether you're organizing a wedding, corporate event, birthday party, or concert — Eventora helps you stay in control. With real-time collaboration, smart scheduling, and intuitive tools, users can manage bookings, track tasks, and communicate with clients or vendors all in one place. Designed for both planners and attendees, Eventora combines simplicity with powerful features to make every event a seamless and memorable experience
              </p>
            </div>
            <div className="col-12 col-md-6">
              <img src={img} style={{ "height": "-webkit-fill-available", "width": "-webkit-fill-available" }} alt="" />
            </div>
          </div>
        </div>
      </section>
      {/* section Button */}
      <section id="more-about" className="more-about mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-6 px-0">
              <img src={more_about} style={{ "height": "-webkit-fill-available", "width": "-webkit-fill-available" }} alt="" />
            </div>
            <div className="col-12 col-lg-6" style={{ "background": "#d6e2f5", "padding": "95px 50px" }}>
              <h1 className="more-heading">
                Why Eventora is best
              </h1>
              <p className="more-text">
                At Eventora, we turn your vision into unforgettable experiences. With seamless planning, real-time coordination, and a user-friendly interface, we simplify every step of your event journey. Whether it's a wedding, corporate meetup, or private party — we handle the details, so you can focus on the moments that matter
              </p>
              <Link to={"/dashboard/create-event"}>
                <button className="filled-btn">
                  Organize your Event
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section id="reviews" className="reviews">
        <div className="container">
          <div className="row">
            <h1 className="text-center review-heading  mb-5">
              What Our Customers Says
            </h1>
            <div className="col-12 col-md-6 col-lg-4 my-3">
              <div className="review-card">
                <div className="review-header">
                  <img src="https://ui-avatars.com/api/?name=JD&background=fff&color=333f4c&size=50" alt="Default User" className="avatar" />

                  <div className="user-info">
                    <h4>Jane Doe</h4>
                    <p>Event Organizer</p>
                  </div>
                </div>
                <div className="review-body">
                  <p>
                    “Eventora made my event planning effortless! From organizing vendors to
                    managing guests, it was all smooth and intuitive. Highly recommend!”
                  </p>
                </div>
              </div>

            </div>
            <div className="col-12 col-md-6 col-lg-4 my-3">
              <div className="review-card">
                <div className="review-header">
                  <img src="https://ui-avatars.com/api/?name=JD&background=fff&color=333f4c&size=50" alt="Default User" className="avatar" />

                  <div className="user-info">
                    <h4>Jane Doe</h4>
                    <p>Event Organizer</p>
                  </div>
                </div>
                <div className="review-body">
                  <p>
                    “Eventora made my event planning effortless! From organizing vendors to
                    managing guests, it was all smooth and intuitive. Highly recommend!”
                  </p>
                </div>
              </div>

            </div>
            <div className="col-12 col-md-6 col-lg-4 my-3">
              <div className="review-card">
                <div className="review-header">
                  <img src="https://ui-avatars.com/api/?name=JD&background=fff&color=333f4c&size=50" alt="Default User" className="avatar" />

                  <div className="user-info">
                    <h4>Jane Doe</h4>
                    <p>Event Organizer</p>
                  </div>
                </div>
                <div className="review-body">
                  <p>
                    “Eventora made my event planning effortless! From organizing vendors to
                    managing guests, it was all smooth and intuitive. Highly recommend!”
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
