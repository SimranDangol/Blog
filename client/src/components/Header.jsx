import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaMoon, FaHome, FaPen, FaSearch, FaTimes } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md transition-colors duration-300">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Blog Title */}
        <div className="flex items-center">
          <NavLink
            to="/"
            className="sm:text-2xl text-[18px] font-bold text-gray-800 dark:text-white"
          >
            <h1>My Blog</h1>
          </NavLink>
        </div>

        {/* Search Input */}
        <div className="hidden md:flex items-center space-x-2 relative">
          <Input
            placeholder="Search..."
            className="rounded border border-gray-300 dark:border-gray-600 pl-10"
          />
          <FaSearch className="absolute left-2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Navbar */}
        <div className="hidden md:flex space-x-4 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-red-500 dark:text-red-300"
                : "flex items-center text-gray-800 dark:text-white"
            }
          >
            <FaHome className="w-5 h-5 mr-1" /> Home
          </NavLink>
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-red-500 dark:text-red-300"
                : "flex items-center text-gray-800 dark:text-white"
            }
          >
            <FaPen className="w-5 h-5 mr-1" /> Write
          </NavLink>

          {/* Login Button */}
          <NavLink to="/login">
            <Button>Login</Button>
          </NavLink>

          {/* Dark Mode Icon for larger screens */}
          <button className="flex items-center p-2 ml-2" aria-label="Dark mode">
            <FaMoon className="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-600" />
          </button>
        </div>

        {/* Login Button and Hamburger Menu for Mobile */}
        <div className="flex items-center md:hidden space-x-2">
          {/* Dark Mode Icon for Mobile */}
          <button className="flex items-center p-2" aria-label="Dark mode">
            <FaMoon className="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-600" />
          </button>
          <NavLink to="/login">
            <Button size="sm">Login</Button>
          </NavLink>
          <button className="p-2" onClick={toggleMenu} aria-label="Menu">
            {isOpen ? (
              <FaTimes className="w-6 h-6 text-gray-800 dark:text-white" />
            ) : (
              <GiHamburgerMenu className="w-6 h-6 text-gray-800 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-red-500 dark:text-red-300"
                : "flex items-center text-gray-800 dark:text-white"
            }
          >
            <FaHome className="w-5 h-5 mr-1" /> Home
          </NavLink>
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-red-500 dark:text-red-300"
                : "flex items-center text-gray-800 dark:text-white"
            }
          >
            <FaPen className="w-5 h-5 mr-1" /> Write
          </NavLink>

          {/* Search Input */}
          <div className="flex items-center space-x-2 relative mt-2">
            <Input
              placeholder="Search..."
              className="rounded border border-gray-300 dark:border-gray-600 pl-10"
            />
            <FaSearch className="absolute left-2 w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
