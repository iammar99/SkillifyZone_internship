import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'
import { message } from 'antd'

const ProfileContext = createContext()

export default function ProfileContextProvider({ children }) {



    const [profile, setProfile] = useState({})
    const fetchData = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/profile/user/${id}`, {
                method: "GET",
                header: {
                    "Content-Type": "aplication/json"
                },
                credentials: "include",
            })

            const result = await response.json()
            if(result.success){
                setProfile(result.data)
            }
            else{
                console.error("error While loading profile")
            }
            console.log("context",result.data)
        } catch (error) {
            console.error(error)

        }
    }

    useEffect(() => {
        var userFound = JSON.parse(localStorage.getItem("user"))
        if (userFound) {
            fetchData(userFound.id)
        }
    }, [])
    return (
        <ProfileContext.Provider value={{ profile, setProfile, fetchData }}>
            {children}
        </ProfileContext.Provider>
    )
}


export const useProfileContext = () => useContext(ProfileContext)