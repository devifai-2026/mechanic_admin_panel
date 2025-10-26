import { useNavigate } from "react-router-dom";
import { adminLogout } from "../apis/authApi";
import { useState } from "react";

export default function LogoutButton() {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
          const res  = await adminLogout();
          console.log(res)
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            navigate("/signin");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-center">
                <p className="font-medium">Notice:</p>
                <p>Your account is already logged in on another device.</p>
            </div>

            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`px-6 py-3 w-full sm:w-auto rounded-lg text-white font-medium 
                    ${isLoggingOut ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
                    transition-colors duration-200 shadow-md`}
            >
                {isLoggingOut ? "Logging out..." : "Logout"}
            </button>

            {isLoggingOut && (
                <p className="mt-2 text-gray-600 text-sm">Please wait, you're being logged out...</p>
            )}
        </div>
    );
}