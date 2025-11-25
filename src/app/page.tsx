"use client";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { LoginRequest, loginRequest, LoginResult } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      <div className="font-poppins w-screen h-screen flex flex-col justify-center items-center">

        <div className="w-[770px] h-[550px] px-8 flex flex-col items-center">

          <div className="flex flex-row items-center justify-center space-x-6">
            <Image src={"/icon.png"} alt="logo" width={94} height={76} />
            <h1 className="text-5xl text-[#595959]">Adiwarna Pratama</h1>
          </div>

          <h1 className="text-5xl text-[#595959] mt-2">Sign In</h1>

          <form className="w-full flex flex-col mt-8" onSubmit={handleSignIn}>

            <label htmlFor="email" className="font-bold text-xl pl-3 mb-2">
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

            <label htmlFor="password" className="font-bold text-xl pl-3 mb-2 mt-8">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="h-11 border-[#AAAAAA] border-2 rounded-lg placeholder:text-xl px-3"
              placeholder="Add password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="mt-12 h-[70px] text-white bg-[#31C6D4] text-3xl rounded-sm"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex mt-6 space-x-4">
              <input type="checkbox" id="remember" className="w-9 h-9" />
              <label htmlFor="remember" className="text-2xl text-[#595959]">
                Remember Me
              </label>
            </div>

          </form>

        </div>
      </div>
    </>
  );
}
