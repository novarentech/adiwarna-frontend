// "use client";
// // import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { MdSupervisorAccount } from "react-icons/md";

// import { FaRegEye } from "react-icons/fa6";
// import { FaRegEyeSlash } from "react-icons/fa6";



// export default function CreateAccountPage() {

//     const [showPass, setShowPass] = useState(false);

//     const handleCreateAccount = (e: React.FormEvent) => {

//     }

//     return (
//         <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
//             {/* title container */}
//             <div className="flex flex-row items-center space-x-2 mt-2">
//                 <MdSupervisorAccount className="text-black w-10 h-10" />
//                 <h1 className="text-3xl font-normal">Create Account  </h1>
//             </div>

//             {/* start of form container */}
//             <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
//                 {/* start form */}
//                 <form onSubmit={handleCreateAccount} className="flex flex-col">
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
//                     </div>
//                     {/* confirm-password */}
//                     {/* <div className="flex flex-col space-y-1 mt-4">
//                         <label htmlFor="acc-co-pass" className="font-bold">Password</label>
//                         <div className="flex">
//                             <input type="password" id="acc-co-pass" className="flex-1 border rounded-sm h-9 px-2" placeholder="Input Password" />
//                         </div>
//                     </div> */}
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

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { MdSupervisorAccount } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { createUser } from "@/lib/account";

export default function CreateAccountPage() {
    const router = useRouter();

    const [showPass, setShowPass] = useState(false);

    // Form values
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        usertype: "",
        password: "",
        password_confirmation: "",
    });

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!form.name || !form.email || !form.phone || !form.usertype) {
            alert("Please fill all required fields!");
            return;
        }

        if (form.password !== form.password_confirmation) {
            alert("Password does not match!");
            return;
        }

        // Submit request
        const res = await createUser(form);

        if (!res.success) {
            alert("Failed: " + res.message);
            return;
        }

        alert("User created successfully!");
        router.push("/admin/accounts");
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdSupervisorAccount className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Create Account</h1>
            </div>

            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12">
                <form onSubmit={handleCreateAccount} className="flex flex-col">

                    {/* name */}
                    <div className="flex flex-col space-y-1">
                        <label className="font-bold">Name</label>
                        <input
                            type="text"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Enter name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    {/* phone */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Phone Number</label>
                        <input
                            type="text"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Enter phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    {/* position */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Position</label>
                        <select
                            className="border rounded-sm h-9 px-2"
                            value={form.usertype}
                            onChange={(e) => setForm({ ...form, usertype: e.target.value })}
                        >
                            <option value="" disabled hidden>Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="teknisi">Teknisi</option>
                        </select>
                    </div>

                    {/* email */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Email</label>
                        <input
                            type="email"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    {/* password */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Password</label>
                        <div className="flex items-center border rounded-sm h-9 px-2">
                            <input
                                type={showPass ? "text" : "password"}
                                className="flex-1 outline-none"
                                placeholder="Enter Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="text-gray-600"
                            >
                                {showPass ? <FaRegEyeSlash className="w-6 h-6" /> : <FaRegEye className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* confirm password */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Confirm Password</label>
                        <input
                            type="password"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Confirm Password"
                            value={form.password_confirmation}
                            onChange={(e) =>
                                setForm({ ...form, password_confirmation: e.target.value })
                            }
                        />
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href="/admin/accounts" className="bg-red-500 text-white h-10 rounded-sm flex items-center justify-center">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="bg-[#17a2b8] text-white h-10 rounded-sm flex items-center justify-center"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            <div className="h-20 text-transparent">.</div>
        </div>
    );
}
