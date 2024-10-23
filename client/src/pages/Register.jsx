import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner"; 
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; 

const SignUp = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = (formData) => {
    const { fullName, email, password } = formData;

    // Check for empty fields
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields!");
      return false; // Prevent further processing
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return false;
    }

    if (password.length > 16) {
      toast.error("Password cannot be longer than 16 characters!");
      return false;
    }

    return true; // Validation passed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post("/api/v1/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false); // Ensure loading is reset after the API call
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create your account!
        </h2>

        {/* Google Sign Up Button */}
        <Button
          variant="outline"
          className="flex items-center justify-center w-full gap-2 py-5 mb-4 text-base text-gray-900 border border-gray-300 dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 md:text-lg"
          type="button"
        >
          <img src={logo} alt="Google logo" className="w-5" />
          Sign up with Google
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-600 uppercase dark:text-gray-400">
            <span className="px-2 bg-white dark:bg-gray-800">
              or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Your Full Name"
              type="text"
              required
              className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="email@example.com"
              type="email"
              required
              className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
              className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              onChange={handleChange}
            />
          </div>

          <Button
            className="flex items-center justify-center w-full text-white bg-red-500 hover:bg-red-600"
            type="submit"
            disabled={loading} // Disable button when loading
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
            {loading && <span className="ml-2">Signing Up...</span>}
          </Button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          <span className="text-base md:text-lg">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-base font-medium text-red-500 underline hover:text-red-600 md:text-lg"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


