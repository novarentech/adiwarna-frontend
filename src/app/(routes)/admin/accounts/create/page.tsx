"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { MdSupervisorAccount } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { createUser } from "@/lib/account";
import { toast } from "sonner";

export default function CreateAccountPage() {
    const router = useRouter();

    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

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
            toast.error("Please fill all required fields!");
            return;
        }

        if (form.password !== form.password_confirmation) {
            toast.error("Password does not match!");
            return;
        }

        // Submit request
        const res = await createUser(form);

        if (!res.success) {
            toast.error("Failed: " + res.message);
            return;
        }

        toast.success("User created successfully!");
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
                        <div className="flex items-center border rounded-sm h-9 px-2">

                            <input
                                type={showPass2 ? "text" : "password"}
                                className="flex-1 outline-none"
                                placeholder="Confirm Password"
                                value={form.password_confirmation}
                                onChange={(e) =>
                                    setForm({ ...form, password_confirmation: e.target.value })
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass2(!showPass2)}
                                className="text-gray-600"
                            >
                                {showPass2 ? <FaRegEyeSlash className="w-6 h-6" /> : <FaRegEye className="w-6 h-6" />}
                            </button>
                        </div>
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
