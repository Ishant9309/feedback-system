import React from "react";
import { Link } from "react-router-dom";
import collegeLogo from "../assets/college-logo.png";
import msbteLogo from "../assets/msbte-logo.png";

function Header() {
  return (
    <header className="bg-blue-900 text-white shadow-md">

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3">

        {/* Left Logo */}
        <img
          src={collegeLogo}
          alt="College Logo"
          className="h-14 w-14 rounded-full border-2 border-white object-cover"
        />

        {/* Title */}
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-bold leading-tight">
            Matoshri Pratishthan's Vishwabharti Polytechnic Institute
          </h2>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          <Link
            to="/admin-login"
            className="bg-white text-blue-900 px-4 py-1 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            Admin Login
          </Link>

          <img
            src={msbteLogo}
            alt="MSBTE Logo"
            className="h-14 w-14 rounded-full border-2 border-white object-cover"
          />

        </div>

      </div>

    </header>
  );
}

export default Header;