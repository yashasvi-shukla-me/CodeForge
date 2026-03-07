import React from "react";
import { User, Code, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import symbol from "../assets/symbol.png";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-base-100 shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90"
        >
          <img
            src={symbol}
            alt="CodeForge"
            className="h-9 w-9 rounded-lg bg-primary/10 p-1"
          />
          <span className="text-xl font-bold tracking-tight text-base-content">
            Code<span className="text-primary">Forge</span>
          </span>
        </Link>

        {/* Not logged in */}
        {!authUser && (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="btn btn-ghost btn-sm gap-1.5 text-base-content/80 hover:text-base-content"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm gap-1.5">
              <UserPlus className="h-4 w-4" />
              Sign up
            </Link>
          </div>
        )}

        {/* Logged in: user menu */}
        {authUser && (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full ring-2 ring-primary/20">
                <img
                  src="https://api.dicebear.com/9.x/bottts/svg?seed=Andrea"
                  alt="Profile"
                  className="object-cover rounded-full"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 w-56 rounded-xl border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              <li className="menu-title px-3 py-2">
                <span className="font-semibold text-base-content">{authUser?.name}</span>
              </li>
              <li>
                <Link to="/profile" className="gap-2 rounded-lg">
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
              </li>
              {authUser?.role === "ADMIN" && (
                <li>
                  <Link to="/add-problem" className="gap-2 rounded-lg">
                    <Code className="h-4 w-4" />
                    Add Problem
                  </Link>
                </li>
              )}
              <li>
                <LogoutButton className="gap-2 rounded-lg text-error hover:bg-error/10 hover:text-error">
                  <LogOut className="h-4 w-4" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
