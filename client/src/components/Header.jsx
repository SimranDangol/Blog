import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaPen, FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FiMoon, FiUser, FiLogOut } from "react-icons/fi";
import { RiMenu5Fill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { IoSunnyOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleTheme } from "../redux/theme/themeSlice";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/user/userSlice";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import i from "../assets/i.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get("searchTerm");
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    } catch (error) {
      console.error("Error parsing URL parameters:", error);
    }
  }, [location.search]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const res = await axios.post("/api/v1/auth/logout");
      dispatch(signOutSuccess(res.data));
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout. Please try again.");
      dispatch(signOutFailure());
    }
  };

  const handleSearch = (searchTerm) => {
    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searchTerm", searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    } catch (error) {
      console.error("Error handling search:", error);
      toast.error("Search failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleSearchIconClick = () => {
    handleSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm);
    }
  };

  return (
    <header className="bg-white border-b shadow-md dark:bg-[rgba(10,10,10,0.5)] dark:border-gray-600 dark:shadow-lg">
      <nav className="flex items-center justify-between max-w-6xl p-4 mx-auto sm:px-6 lg:px-8">
        {/* Blog Title */}
        <div className="flex items-center space-x-2">
          <NavLink
            to="/"
            className="flex items-center text-lg font-bold text-gray-900 sm:text-xl dark:text-white"
          >
            <img src={i} alt="" className="w-8 mr-2 filter grayscale" />{" "}
            BlogWave
          </NavLink>
        </div>

        {/* Search Input */}
        <div className="relative hidden md:flex w-36 lg:w-52">
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-4 pr-10 text-gray-700 bg-gray-100 border border-gray-500 rounded-lg dark:bg-gray-900 dark:text-slate-100"
            />
            <FaSearch
              className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 cursor-pointer right-2 top-1/2"
              onClick={handleSearchIconClick}
            />
          </form>
        </div>

        {/* Navbar Links */}
        <div className="items-center hidden space-x-3 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
          >
            <FaHome className="w-5 h-5 mr-1" /> Home
          </NavLink>
          <NavLink
            to="/create-blog"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
          >
            <FaPen className="w-5 h-5 mr-1" /> Write
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
          >
            <HiDocumentText className="w-5 h-5 mr-1" /> Blogs
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
          >
            <LuLayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
          </NavLink>
        </div>

        {/* Dark Mode Toggle and Login Button for All Devices */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2"
            aria-label="Toggle theme"
            onClick={handleThemeToggle}
          >
            {theme === "dark" ? (
              <FiMoon className="w-5 h-5 text-white transition hover:text-gray-300" />
            ) : (
              <IoSunnyOutline className="w-5 h-5 text-gray-800 transition hover:text-gray-600" />
            )}
          </button>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar>
                  <AvatarImage
                    src={
                      currentUser?.data?.profilePicture ||
                      "https://imgs.search.brave.com/cCOisTMPj8qdqZOwLH0lS9fTz3Ww_9CUoYjXnVHvA5Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3Lzk1Lzk1LzE0/LzM2MF9GXzc5NTk1/MTQwNl9oMTdleXd3/SW8zNkRVMkw4alh0/c1VjRVhxUGVTY0JV/cS5qcGc"
                    }
                    alt="User profile"
                  />
                  <AvatarFallback>
                    {currentUser?.data?.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <NavLink to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <FiUser className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </NavLink>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavLink to="/login">
              <Button className="ml-2">Login</Button>
            </NavLink>
          )}

          {/* Mobile Menu Button */}
          <button
            className="flex items-center p-2 ml-2 text-gray-900 dark:text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <IoIosClose className="w-8 h-8" />
            ) : (
              <RiMenu5Fill className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col items-start p-4 space-y-4 bg-white md:hidden dark:bg-[rgba(10,10,10,0.5)]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <FaHome className="w-5 h-5 mr-1" /> Home
          </NavLink>
          <NavLink
            to="/create-blog"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <FaPen className="w-5 h-5 mr-1" /> Write
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <HiDocumentText className="w-5 h-5 mr-1" /> Blogs
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center hover:text-red-500 ${
                isActive ? "text-red-500" : "text-gray-900 dark:text-white"
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <LuLayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
          </NavLink>

          {/* Search Input in Mobile */}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-4 pr-10 text-gray-700 bg-gray-100 border border-gray-500 rounded-lg dark:bg-gray-900 dark:text-slate-100"
              />
              <FaSearch
                className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 cursor-pointer right-2 top-1/2"
                onClick={handleSearchIconClick}
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
