import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"

import { getUsers } from "@/server/users"
import { Button } from "./ui/button"
import { Pencil } from "lucide-react"
import UserForm from "./forms/user-form"
import DeleteUserButton from "./delete-user-button"


export const UsersTable = async () => {
    const users = await getUsers()
    return (
        <>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Email</TableHead>
                        <TableHead>UserName</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.createdAt?.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost">
                                                <Pencil className="size-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit User</DialogTitle>
                                                <UserForm user={user} />
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                    <DeleteUserButton userId={user.id} />
                                </TableCell>
                            </TableRow>
                        ))
                    }

                </TableBody>
            </Table>
        </>
    )
}
