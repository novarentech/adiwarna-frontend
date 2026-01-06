"use client";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LoginRequest, loginRequest, LoginResult } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  // store images
  const images = [
    "login1.jpeg",
    "login2.jpeg",
    "login3.jpeg",
    "login4.jpeg",
    "login5.jpeg",
    "login6.jpeg",
    "login7.png",
  ]
  const extendedImages = [...images, images[0]];

  const [currentIndex, setCurrentIndex] = useState(0);
  // const [fade, setFade] = useState(true);
  const intervalDuration = 4000;

  const [enableTransition, setEnableTransition] = useState(true);



  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // Calculate the next index, looping back to 0 if at the end
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, intervalDuration);

  //   // Cleanup function to clear the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFade(false); // fade out

  //     setTimeout(() => {
  //       setCurrentIndex((prev) => (prev + 1) % images.length);
  //       setFade(true); // fade in
  //     }, 1000); // durasi fade
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [images.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currentIndex === images.length) {
      // tunggu animasi selesai
      setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
      }, 700); // harus sama dengan duration animasi
    } else {
      setEnableTransition(true);
    }
  }, [currentIndex]);



  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: LoginRequest = { email, password };


    const result: LoginResult = await loginRequest(payload);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    // --- LOGIKA REMEMBER ME ---
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    // ---------------------------

    if (result?.user?.usertype === "admin") {
      router.push("/admin/dashboard");
    } else if (result?.user?.usertype === "teknisi") {
      router.push("/teknisi");
    }

    // alert("Login Berhasil!");
    if (result?.user?.usertype === "admin") {
      router.push("/admin/dashboard"); // sesuaikan routing
      toast.success("Successfully signed in as Admin");
    }
    if (result?.user?.usertype === "teknisi") {
      router.push("/teknisi"); // sesuaikan routing
      toast.success("Successfully signed in as teknisi");
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
                <input
                  type="checkbox"
                  id="remember"
                  className="w-6 h-6 cursor-pointer"
                  checked={rememberMe} // Tambahkan ini
                  onChange={(e) => setRememberMe(e.target.checked)} // Tambahkan ini
                />
                <label htmlFor="remember" className="text-lg text-[#595959] cursor-pointer">
                  Remember Me
                </label>
              </div>

            </form>

          </div>
        </div>

        {/* right side */}
        {/* <div className="p-6">
          <div className={`w-full h-full rounded-r-[20px] bg-cover bg-center transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`} style={{
            backgroundImage: `url(/images/${images[currentIndex]})`,
          }}>
          </div>
        </div> */}
        {/* right side */}
        {/* <div className="m-6 overflow-hidden rounded-r-[20px]">
          <div
            className="w-full h-full rounded-r-[20px] flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className="min-w-full h-full bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(/images/${img})`,
                }}
              />
            ))}
          </div>
        </div> */}
        <div className="m-6 overflow-hidden rounded-r-[20px]">
          <div
            className={`w-full h-full flex ${enableTransition ? "transition-transform duration-700 ease-in-out" : ""
              }`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {extendedImages.map((img, index) => (
              <div
                key={index}
                className="min-w-full h-full bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(/images/${img})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
