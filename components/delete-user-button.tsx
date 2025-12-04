"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { deleteUser } from "@/server/users"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner";
import { Button } from "./ui/button"
import { Loader2, Trash2 } from "lucide-react"

interface DeleteUserButtonProp {
    userId : string
}

export default function DeleteUserButton({userId} : DeleteUserButtonProp) {

    const [isLoading , setIsLoading] = useState(false)
    const [isOpen , setIsOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async()=>{
        try{
            setIsLoading(true)
            await deleteUser(userId)
            toast.success("User deteted SucessFully")
            setIsOpen(false)
            router.refresh()

        }catch(error){
            console.error(error)
            toast.error("Failed to delete user")

        }finally{
                setIsLoading(false)
        }

    }


    return (
        <Dialog open={isOpen}  onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Trash2  className="size-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                    <Button 
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleDelete}
                    >
                            {isLoading ? <Loader2  className="size-4 animate-spin"/> : "Delete"}
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )

}