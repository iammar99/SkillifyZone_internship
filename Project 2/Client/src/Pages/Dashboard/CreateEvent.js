import { message } from 'antd';
import React, { useState } from 'react'

export default function CreateEvent() {


  const [state, setState] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { eventDate, eventDescription, eventLocation, eventName, organizerName } = state
    const [date, time] = eventDate.split('T');

    const formattedDate = new Date(date).toLocaleDateString();
    const formattedTime = time;

    if (!formattedDate || !formattedTime || !eventDescription || !eventLocation || !eventName || !organizerName) {
      message.error("Fill all inputs")
      setIsLoading(false)
      return
    }

    const response = await fetch('http://localhost:8000/create', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ formattedDate, formattedTime, eventDescription, eventLocation, eventName, organizerName })
    })

    const result = await response.json()
    if(result.success){
      message.success(result.message)
    }
    else{
      message.error(result.message)
    }
    setIsLoading(false)
    console.log(result)
    console.log(eventDate, eventDescription, eventLocation, eventName, organizerName)
    console.log(state)
  }

  return (
    <main>
      <div className="container">
        <div className="row">
          <h1 className="text-center create-heading mt-5 mb-3">
            Schedule Your Events
          </h1>
          <div className="col">
            <form className='mb-5'>

              <div className="mb-3">
                <label htmlFor="organizerName" className="form-label">
                  Organizer Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="organizerName"
                  name="organizerName"
                  onChange={handleChange}
                  placeholder="Enter organizer's name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="eventName" className="form-label">
                  Event Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="eventName"
                  name="eventName"
                  onChange={handleChange}
                  placeholder="Enter event name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="eventDescription" className="form-label">
                  Event Description
                </label>
                <textarea
                  className="form-control"
                  id="eventDescription"
                  name="eventDescription"
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your event"
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="eventDate" className="form-label">
                  Event Date
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="eventDate"
                  name="eventDate"
                  onChange={handleChange}
                />
              </div>



              <div className="mb-3">
                <label htmlFor="eventLocation" className="form-label">
                  Event Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="eventLocation"
                  name="eventLocation"
                  onChange={handleChange}
                  placeholder="Enter event location"
                />
              </div>

              <button type="submit" className="filled-btn event-btn" onClick={handleSubmit}>
                {
                  !isLoading
                    ?
                    "Create Event"
                    :
                    <div className="spinner-grow" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                }
              </button>
            </form>

          </div>
        </div>
      </div>
    </main>
  )
}
