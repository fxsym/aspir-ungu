import { useEffect } from "react";
import { FiMenu } from "react-icons/fi";

export default function Navbar({ showSidebar, setShowSidebar, user }) {

    useEffect(() => {
        console.log(user)
    }, [])

    return (
        <nav className="flex justify-between items-center py-3 px-6 bg-background transition-all duration-500">
            {/* Tombol sidebar */}
            <FiMenu
                size={30}
                onClick={() => setShowSidebar(!showSidebar)}
                className="hover:text-primary cursor-pointer"
            />

            {/* Profil */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="font-bold">{user.name}</span>
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                            <img src={user.image_url} alt="Foto Profil" className="w-full h-full object-cover" />
                        </div>
                    </>
                ) : (
                    <span>Guest</span>
                )}
            </div>

        </nav>
    );
}
