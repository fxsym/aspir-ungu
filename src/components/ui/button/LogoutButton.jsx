'use client'
import { logoutAction } from "@/actions/logout.action";
import { useState } from "react";
import Text from "../typography/Text";

export default function LogoutButton({ children = "Logout", className }) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logoutAction();
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`bg-primary p-3 rounded-full hover:cursor-pointer ${className}`}
        >
            <Text>
                {loading ? "Logging out..." : children}
            </Text>
        </button>
    );
}