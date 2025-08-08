import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'

const ProfileContext = createContext()

export default function ProfileContextProvider({ children }) {



    const [profile, setProfile] = useState({})
    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        try {
            const response = await fetch(`http://localhost:8000/profile/user/${user.id}`, {
                method: "GET",
                header: {
                    "Content-Type": "aplication/json"
                },
                credentials: "include",
            })

            const result = await response.json()
            setProfile(result.data)
        } catch (error) {
            console.error(error)

        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}


export const useProfileContext = () => useContext(ProfileContext)