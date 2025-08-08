import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'

const ProfileImageContext = createContext()


export default function ProfileImageContextProvider({ children }) {

    const [profileImg, setProfileImg] = useState(null)


    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        try {
            const response = await fetch(`http://localhost:8000/navImage/user/${user.id}`, {
                method: "GET",
                credentials: "include",
            })
            const result = await response.json()
            setProfileImg(result.img)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <ProfileImageContext.Provider value={{ profileImg, setProfileImg }}>
            {children}
        </ProfileImageContext.Provider>
    )
}


export const useProfileImageContext = () => useContext(ProfileImageContext)