'use client'
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { AuthActions } from "@/app/auth/utils";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/logo.webp";
import { useRouter } from "next/navigation";



function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  // const { data: user } = useSWR("/auth/users/me", fetcher);

  const { logout, removeTokens } = AuthActions();

  const handleBooking = () => {
  
  }

  const handleProfile = () => {
    router.push("profile");
  }

  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();

        router.push("/");
      })
      .catch(() => {
        removeTokens();
        router.push("/");
      });
  };

  return (
    <header className="flex flex-row items-center justify-between sm:justify-around p-2 border-b-2 bg-green-100">
      <div className="text-left font-bold">
                  <span className="mb-2">
                      <Image src={logo} alt="Company logo" width={160} height={160} placeholder="blur"/>
                  </span>
              </div>
      <nav className="hidden sm:flex justify-between items-center gap-4 font-semibold">
        <Link href={'/dashboard'} className="hover:text-green-500 text-green-900">
          Home
        </Link>
        <Link href="#" className="hover:text-green-500 text-green-900">
          About
        </Link>
        <button
          onClick={handleBooking}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-800 transition-colors"
        >
          Book Appointment
        </button>
        <button
          onClick={handleProfile}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-800 transition-colors"
        >
          Update Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-300 text-white px-4 py-1 rounded hover:bg-red-400 transition-colors"
        >
          Logout
        </button>
      </nav>
      <nav className="sm:hidden flex flex-col items-end gap-1 font-semibold">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="sm:hidden font-bold text-xl hover:text-green-500"
        >
          {showMenu ? <GrClose /> : <GiHamburgerMenu />}
        </button>
        {showMenu && (
          <>
            <Link href="#" className="hover:text-gray-500">
              Home
            </Link>
            <Link href="#" className="hover:text-gray-500">
              Update Profile
            </Link>
            <button
          onClick={handleBooking}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-800 transition-colors"
        >
          Book Appointment
        </button>
            <button
          onClick={handleLogout}
          className="bg-red-300 text-black px-4 py-1 rounded hover:bg-red-400 transition-colors"
        >
          Logout
        </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;