
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to logout. Please try again.");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-orange-500 text-white px-5 py-2 rounded-md hover:bg-orange-600"
        >
            Logout
        </button>
    );
}

export default Logout;
