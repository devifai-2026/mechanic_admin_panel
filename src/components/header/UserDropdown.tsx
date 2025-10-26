import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import { adminLogout } from "../../apis/authApi";
import Button from './../ui/button/Button';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch (err) {
      // Optionally handle error
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      navigate("/signin");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center w-full justify-between px-2 py-1 hover:bg-[#e5e5e5] transition"
      >
        {/* Logo / Image */}
        <div className="h-8 w-auto">
          <img
            src="https://i.ibb.co/nq91LYHx/Whats-App-Image-2025-05-18-at-12-40-48-AM.jpg"
            alt="User"
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Arrow */}
        <svg
          className={`w-4 h-4 ml-2 text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown content */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className=""
      >
        <div className="py-1">
          <Button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            <span className="">Sign out</span>
          </Button>
        </div>
      </Dropdown>
    </div>
  );
}
