// "use client";

// import Link from "next/link";
// import { FiPlus } from "react-icons/fi";
// // import { IoIosSearch } from "react-icons/io";

// import { MdSupervisorAccount } from "react-icons/md";



// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// import { MdEdit } from "react-icons/md";
// import { FaTrash } from "react-icons/fa";

// export default function AccountsPage() {
//     return (
//         <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
//             {/* title container */}
//             <div className="flex flex-row items-center space-x-2 mt-2">
//                 <MdSupervisorAccount className="text-black w-10 h-10" />
//                 <h1 className="text-3xl font-normal">Accounts</h1>
//             </div>

//             {/* list quotations */}
//             <div className="bg-white mt-12">
//                 <div className="py-3 px-4 flex justify-between border rounded-t-sm">
//                     {/* create quotations button */}
//                     <Link href={"/admin/accounts/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
//                     {/* search bar */}
//                     {/* <form className="flex flex-row">
//                         <input id="search-input" type="text" className="w-[250px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm" placeholder="Search customer .." />
//                         <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
//                     </form> */}
//                 </div>
//                 <div className="py-5 px-4 flex flex-col border-b border-x rounded-b-sm">
//                     <Table className="bg-[#f2f2f2]">
//                         <TableHeader>
//                             <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
//                                 <TableHead className="text-[#212529] w-[5%] font-bol text-center"><input type="checkbox" /></TableHead>
//                                 <TableHead className="text-[#212529] w-[20%] font-bold text-left">Name</TableHead>
//                                 <TableHead className="text-[#212529] w-[10%] font-bold text-center">Phone number</TableHead>
//                                 <TableHead className="text-[#212529] w-[20%] font-bold text-center">Role</TableHead>
//                                 <TableHead className="text-[#212529] w-[30%] font-bold text-left">Email</TableHead>
//                                 <TableHead className="text-[#212529] w-[15%] font-bold text-center">Action</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>

//                             {/* list account */}
//                             <TableRow>
//                                 <TableCell className="font-medium text-center py-6"><input type="checkbox" /></TableCell>
//                                 {/* nama akun */}
//                                 <TableCell className="font-medium text-left whitespace-normal wrap-break-words overflow-hidden">
//                                     <p className="my-auto">nama employee</p>
//                                 </TableCell>
//                                 {/* phone number */}
//                                 <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">+628xxxxxxx</TableCell>
//                                 <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">Admin</TableCell>
//                                 <TableCell className="text-left whitespace-normal wrap-break-words overflow-hidden">email@mail.com</TableCell>
//                                 <TableCell className="text-center">
//                                     <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
//                                         <Link href={"/admin/accounts/edit/1"}><MdEdit className="w-7 h-7" /></Link>
//                                         <div><FaTrash className="w-5 h-5 text-red-500" /></div>
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         </TableBody>
//                     </Table>

//                     {/* Pagination */}
//                     <div className="flex flex-row space-x-2 mx-auto">
//                         {/* previous */}
//                         <div>
//                             Previous
//                         </div>
//                         <div>1</div>
//                         {/* next */}
//                         <div>
//                             Next
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div >
//     )
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { MdSupervisorAccount } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deleteUser, getUsersList } from "@/lib/account";
import { IUser } from "@/lib/auth";

export default function AccountsPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getUsersList(page, 10);

            if (res.success) {
                setUsers(res.data.data);
                setLastPage(res.meta.last_page);
            }

            console.log(res)
        };

        fetchUsers();
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const data = await deleteUser(id);

        if (data.success) {
            // hapus langsung dari state tanpa reload
            setUsers((prev) => prev.filter((u) => u.id !== id));
            alert(data.message);
        } else {
            alert("Failed: " + data.message);
        }
    };

    const handleNext = () => {
        if (page < lastPage) setPage(page + 1);
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdSupervisorAccount className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Accounts</h1>
            </div>

            {/* list accounts */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create user */}
                    <Link href={"/admin/accounts/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">
                        Add Data <FiPlus className="w-5 h-5 ml-1" />
                    </Link>
                </div>

                <div className="py-5 px-4 flex flex-col border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-center"><input type="checkbox" /></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-center">Phone</TableHead>
                                <TableHead className="text-center">Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="text-center py-6"><input type="checkbox" /></TableCell>

                                    <TableCell className="font-medium text-left">
                                        {user.name}
                                    </TableCell>

                                    <TableCell className="text-center">{user.phone}</TableCell>
                                    <TableCell className="text-center">{user.usertype}</TableCell>
                                    <TableCell className="text-left">{user.email}</TableCell>

                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/accounts/edit/${user.id}`}>
                                                <MdEdit className="w-7 h-7" />
                                            </Link>
                                            <FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(user.id)} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex flex-row space-x-4 mt-4 mx-auto">
                        <button
                            onClick={handlePrev}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span>Page {page} / {lastPage}</span>

                        <button
                            onClick={handleNext}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            disabled={page === lastPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
