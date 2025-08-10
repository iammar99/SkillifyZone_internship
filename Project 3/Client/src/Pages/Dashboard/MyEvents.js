import { message } from 'antd'
import ProductLoader from 'Components/Screen Loader/ProductLoader'
import { useAuthContext } from 'Context/AuthContext'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function MyEvents() {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        organizer: '',
        location: '',
        date: '',
        time: ''
    })
    const { user } = useAuthContext()


    // Data fetching

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8000/getEvents", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            const result = await response.json()
            setEvents(result.data)
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])



    // Handling Edit


    const onEdit = (event) => {
        setSelectedEvent(event)
        setEditFormData({
            name: event.name,
            description: event.description,
            organizer: event.organizer,
            location: event.location,
            date: event.date.split('T')[0], // Format date for input
            time: event.time
        })
    }



    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`http://localhost:8000/updateEvent/${selectedEvent._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(editFormData)
            })

            const result = await response.json()

            if (result.success) {
                setEvents(events.map(event =>
                    event._id === selectedEvent._id ? result.data : event
                ))
                message.success(result.message)

            } else {
                message.error(result.message)
            }
        } catch (error) {
            console.error('Error updating event:', error)
        } finally {
            setSelectedEvent(null)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }



    // Handling Delete

    const onDelete = (event) => {
        setSelectedEvent(event)
    }

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:8000/deleteEvent/${selectedEvent._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            const result = await response.json()
            console.log(result)

            if (result.success) {
                setEvents(events.filter(event => event._id !== selectedEvent._id))
                message.success(result.message)

            } else {
                console.error('Failed to delete event')
            }
        } catch (error) {
            console.error('Error deleting event:', error)
        } finally {
            setSelectedEvent(null)
        }
    }

    return (
        <main>

            {
                events.length == 0 && !isLoading
                    ?
                    <>
                        <h1 className="text-center my-5 events-heading">
                            No Events Just create Now
                        </h1>
                        <Link to={"/dashboard/create-event"} className='d-block mx-auto' style={{ "width": "fit-content" }}>
                            <button className="filled-btn" >
                                Organize your Event
                            </button>
                        </Link>
                    </>
                    :
                    <div className="container">
                        <div className="row">
                            <h1 className="text-center my-5 events-heading">
                                My Events
                            </h1>
                            {isLoading ? (
                                <ProductLoader />
                            ) : (
                                <>
                                    {events.map((event, index) => {
                                        const eventDate = new Date(event.date).toLocaleDateString();
                                        const convertToAMPM = (time) => {
                                            let [hours, minutes] = time.split(':');
                                            hours = parseInt(hours);
                                            const ampm = hours >= 12 ? 'PM' : 'AM';
                                            hours = hours % 12;
                                            hours = hours ? hours : 12;
                                            return `${hours}:${minutes} ${ampm}`;
                                        };

                                        // Example Usage:
                                        const eventTime = convertToAMPM(event.time);

                                        return (
                                            <div key={event._id} className="col-12 col-md-6 col-lg-4">
                                                <div className="event-card">
                                                    <div className="card-body mx-auto">
                                                        <h3 className="card-title">{event.name}</h3>
                                                        <p className="card-description">{event.description}</p>
                                                        <p className="card-info">
                                                            <strong>Organizer:</strong> {event.organizer}
                                                        </p>
                                                        <p className="card-info">
                                                            <strong>Location:</strong> {event.location}
                                                        </p>
                                                        <p className="card-info">
                                                            <strong>Date:</strong> {eventDate}
                                                        </p>
                                                        <p className="card-info">
                                                            <strong>Time:</strong> {eventTime}
                                                        </p>

                                                        {/* Edit and Delete Buttons */}
                                                        <div className="card-footer">
                                                            <button
                                                                className="btn btn-primary btn-sm me-2"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#editModal"
                                                                onClick={() => onEdit(event)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#deleteModal"
                                                                onClick={() => onDelete(event)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>

                        <Link to={"/dashboard/create-event"}>
                            <button title="Add" class="cssbuttons-io-button d-block mx-auto my-5">
                                <svg height="25" width="25" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"></path>
                                </svg>
                                <span>Add</span>
                            </button>
                        </Link>
                    </div>
            }

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the event <strong>"{selectedEvent?.name}"</strong>?</p>
                            <p className="text-muted">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} data-bs-dismiss="modal">
                                Delete Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Edit Event</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className='my-3'>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Event Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={editFormData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="organizer" className="form-label">Organizer</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="organizer"
                                                name="organizer"
                                                value={editFormData.organizer}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={editFormData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="location"
                                        name="location"
                                        value={editFormData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="date" className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="date"
                                                name="date"
                                                value={editFormData.date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="time" className="form-label">Time</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="time"
                                                name="time"
                                                value={editFormData.time}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success" data-bs-dismiss="modal">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}