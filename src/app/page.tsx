"use client";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { LoginRequest, loginRequest, LoginResult } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: LoginRequest = { email, password };


    const result: LoginResult = await loginRequest(payload);

    setLoading(false);

    if (!result.success) {
      alert(result.message);
      return;
    }

    // alert("Login Berhasil!");
    if (result?.user?.usertype === "admin") {
      router.push("/admin/dashboard"); // sesuaikan routing
    }
    if (result?.user?.usertype === "teknisi") {
      router.push("/teknisi"); // sesuaikan routing
    }
  };

  return (
    <>
      <Head>
        <title>AWP | Login</title>
        <meta name="description" content="Sign In Page for AWP" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="font-poppins w-screen h-screen grid grid-cols-2">

        {/* left side */}
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row items-center justify-center space-x-4 fixed left-6 top-6  ">
            <Image src={"/icon.png"} alt="logo" width={54} height={44} />
            <h1 className="text-xl text-black">Adiwarna Pratama</h1>
          </div>

          <div className="w-[498px] h-[383px] px-8 flex flex-col items-center">

            <h1 className="text-4xl text-[#595959] mt-2">Sign In</h1>

            <form className="w-full flex flex-col mt-8" onSubmit={handleSignIn}>

              <label htmlFor="email" className="text-xl pl-3 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="h-11 border-[#AAAAAA] border-2 rounded-lg placeholder:text-xl px-3"
                placeholder="Add email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password" className="text-xl pl-3 mb-2 mt-8">
                Password
              </label>

              <div className="flex items-center h-11 border-[#AAAAAA] border-2 rounded-lg px-3">
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  className="flex-1 outline-none"
                  placeholder="Input password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-600"
                >
                  {showPass ? <IoIosEyeOff className="w-6 h-6" /> : <IoIosEye className="w-6 h-6" />}
                </button>
              </div>

              <button
                type="submit"
                className="mt-12 h-[57px] text-white bg-[#31C6D4] text-[26px] rounded-sm hover:contrast-85 active:contrast-80 cursor-pointer"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="flex mt-6 space-x-4 items-center">
                <input type="checkbox" id="remember" className="w-6 h-6" />
                <label htmlFor="remember" className="text-lg text-[#595959]">
                  Remember Me
                </label>
              </div>

            </form>

          </div>
        </div>

        {/* right side */}
        <div className="p-6">
          <div className="w-full h-full bg-[url('/images/adiwarna-login.png')] rounded-r-[20px] bg-cover bg-no-repeat"></div>
        </div>
      </div>
    </>
  );
}
