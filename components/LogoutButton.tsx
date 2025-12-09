"use client"

import { useRouter } from "next/navigation"
import {signOut , auth} from "@/lib/firebase"
import { Button } from "./ui/button"


export default function LogoutButton(){
    const router = useRouter()

    const logOut = async()=>{
        // 1️⃣ Remove Firebase client auth
        await signOut(auth)

        // 2️⃣ Remove server cookie
        await fetch("/api/auth/logout", {method:"POSt"})
        
        // 3️⃣ Redirect
        router.push("/register")
        
    }
    return(
        <Button variant="destructive"  onClick={logOut} >
            Logout
        </Button>
    )

}