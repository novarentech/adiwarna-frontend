// "use client";
// // import Image from "next/image";
// import Link from "next/link";
// import { use, useState } from "react";
// import { MdSupervisorAccount } from "react-icons/md";

// import { FaRegEye } from "react-icons/fa6";
// import { FaRegEyeSlash } from "react-icons/fa6";

// import { FaUserEdit } from "react-icons/fa";



// type EditAccountParams = Promise<{ id: string }>;

// export default function EditAccountPage({
//     params,
// }: {
//     params: EditAccountParams;
// }) {

//     const actualParams = use(params);
//     const id = actualParams.id;

//     const [showPass, setShowPass] = useState(false);

//     const handleEditAccount = (e: React.FormEvent) => {

//     }

//     return (
//         <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
//             {/* title container */}
//             <div className="flex flex-row items-center space-x-2 mt-2">
//                 <FaUserEdit className="text-black w-10 h-10" />
//                 <h1 className="text-3xl font-normal">Edit Account  </h1>
//             </div>

//             {/* start of form container */}
//             <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
//                 {/* start form */}
//                 <form onSubmit={handleEditAccount} className="flex flex-col">
//                     {/* name */}
//                     <div className="flex flex-col space-y-1">
//                         <label htmlFor="acc-name" className="font-bold">Name</label>
//                         <div className="flex">
//                             <input type="text" id="acc-name" className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter name" />
//                         </div>
//                     </div>
//                     {/* Phone Number */}
//                     <div className="flex flex-col space-y-1 mt-4">
//                         <label htmlFor="acc-number" className="font-bold">Phone Number</label>
//                         <div className="flex">
//                             <input type="text" id="acc-number" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add employee name" />
//                         </div>
//                     </div>
//                     {/* Position */}
//                     <div className="flex flex-col space-y-1 mt-4">
//                         <label htmlFor="employee-position" className="font-bold">Position</label>
//                         <div className="flex">
//                             <select id="employee-position" className="flex-1 border rounded-sm h-9 px-2" defaultValue={""}>
//                                 <option value="" disabled hidden>
//                                     Select Role
//                                 </option>
//                                 <option value="admin">Admin</option>
//                                 <option value="teknisi">Teknisi</option>
//                             </select>
//                         </div>
//                     </div>
//                     {/* email */}
//                     <div className="flex flex-col space-y-1 mt-4">
//                         <label htmlFor="acc-email" className="font-bold">Email</label>
//                         <div className="flex">
//                             <input type="email" id="acc-email" className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter email" />
//                         </div>
//                     </div>
//                     {/* password */}
//                     <div className="flex flex-col space-y-1 mt-4">
//                         <label htmlFor="acc-pass" className="font-bold">Password</label>
//                         <div className="flex items-center border rounded-sm h-9 px-2">

//                             {/* Input */}
//                             <input
//                                 type={showPass ? "text" : "password"}
//                                 id="acc-pass"
//                                 className="flex-1 outline-none"
//                                 placeholder="Input Password"
//                             />

//                             {/* Icon Mata */}
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPass(!showPass)}
//                                 className="text-gray-600"
//                             >
//                                 {showPass ? (
//                                     // eye-off
//                                     <FaRegEyeSlash className="w-6 h-6" />
//                                 ) : (
//                                     // eye
//                                     <FaRegEye className="w-6 h-6" />
//                                 )}
//                             </button>

//                         </div>
//                         <p className="mt-2 text-gray-500 text-sm">
//                             *Leave the password blank if unchanged
//                         </p>
//                     </div>
//                     <hr className="border-b my-6" />
//                     <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
//                         <Link href={"/admin/accounts"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
//                         <button type="submit" className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm">Save</button>
//                     </div>
//                 </form>
//                 {/* end form */}
//             </div>
//             {/* end of form container */}

//             <div className="h-20 text-transparent">.</div>
//         </div>
//     )
// }

"use client";

import { IUser } from "@/lib/account";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


export default function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const router = useRouter();

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState("");

    // fetch user by ID
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`/api/users/${id}`, {
                    method: "GET",
                });
                const data = await res.json();
                setUser(data.data);
            } catch (err) {
                console.error("Failed", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [id]);

    // UPDATE USER
    async function handleEditAccount(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;

        const payload: any = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            usertype: user.usertype,
        };

        if (password.trim() !== "") {
            payload.password = password;
            payload.password_confirmation = password;
        }

        const res = await fetch(`/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        alert(data.message || "Updated!");
        if(res.ok){
            router.push("/admin/accounts")
        }
    }

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            <div className="flex flex-row items-center space-x-2 mt-2">
                <FaUserEdit className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Edit Account</h1>
            </div>

            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12">
                <form onSubmit={handleEditAccount} className="flex flex-col">

                    {/* Name */}
                    <div className="flex flex-col space-y-1">
                        <label className="font-bold">Name</label>
                        <input
                            type="text"
                            className="border rounded-sm h-9 px-2"
                            value={user?.name || ""}
                            onChange={(e) => setUser({ ...(user as IUser), name: e.target.value })}
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Phone Number</label>
                        <input
                            type="text"
                            className="border rounded-sm h-9 px-2"
                            value={user?.phone || ""}
                            onChange={(e) => setUser({ ...(user as IUser), phone: e.target.value })}
                        />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Role</label>
                        <select
                            className="border rounded-sm h-9 px-2"
                            value={user?.usertype || ""}
                            onChange={(e) => setUser({ ...(user as IUser), usertype: e.target.value as any })}
                        >
                            <option value="admin">Admin</option>
                            <option value="teknisi">Teknisi</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Email</label>
                        <input
                            type="email"
                            className="border rounded-sm h-9 px-2"
                            value={user?.email || ""}
                            onChange={(e) => setUser({ ...(user as IUser), email: e.target.value })}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Password</label>
                        <div className="flex items-center border rounded-sm h-9 px-2">
                            <input
                                type={showPass ? "text" : "password"}
                                className="flex-1 outline-none"
                                placeholder="Leave empty if unchanged"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}>
                                {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 gap-4">
                        <Link href="/admin/accounts" className="bg-red-500 text-white h-10 flex items-center justify-center rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#17a2b8] text-white h-10 rounded-sm">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
