"use client";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    
  }

  return (
    <>
      <Head>
        <title>AWP | Login</title>
        <meta name="description" content="Sign In Page for AWP" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="font-poppins w-screen h-screen flex flex-col justify-center items-center">
        {/* start of login container */}
        <div className="w-[770px] h-[550px] px-8 flex flex-col items-center">
          {/* title */}
          <div className="flex flex-row items-center justify-center space-x-6">
            <Image src={"/icon.png"} alt="adwd" width={94} height={76} className="" />
            <h1 className="text-5xl text-[#595959]">Adiwarna Pratama</h1>
          </div>

          <h1 className="text-5xl text-[#595959] mt-2">Sign In</h1>

          {/* start of form */}
          <form className="w-full flex flex-col mt-8" onSubmit={handleSignIn}>
            {/* input email */}
            <label htmlFor="email" className="font-bold text-xl pl-3 mb-2">Email</label>
            <input type="email" name="email" id="email" className="h-11 border-[#AAAAAA] border-2 rounded-lg placeholder:text-xl px-3" placeholder="Add email" />
            {/* input password */}
            <label htmlFor="password" className="font-bold text-xl pl-3 mb-2 mt-8">Password</label>
            <input type="password" name="password" id="password" className="h-11 border-[#AAAAAA] border-2 rounded-lg placeholder:text-xl px-3" placeholder="Add email" />
            {/* submit */}
            <button type="submit" className="mt-12 h-[70px] text-white bg-[#31C6D4] text-3xl rounded-sm">Sign In</button>

            <div className="flex mt-6 space-x-4">
              <input type="checkbox" name="remember" id="remember" className="w-9 h-9" />
              <label htmlFor="remember" className="text-2xl text-[#595959]">Remember Me</label>
            </div>
          </form>
          {/* end of form */}
        </div>
        {/* end of login container */}
      </div>
    </>
  );
}
