import { Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { MdHotel } from "react-icons/md";

export default function Navmenu({ isOpen, onClose }) {

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="navmenu"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ backgroundColor: "#1E828F" }}
          className="fixed top-0 left-0 z-50 w-full h-screen text-white flex flex-col shadow-lg md:w-75 md:relative"
        >
          {/* Close */}
          <div className="flex justify-end p-4">
            <IoClose
              size={32}
              onClick={onClose}
              className="cursor-pointer hover:text-red-500"
            />
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-4 p-6 text-lg font-semibold">

            {/* Resort & lainnya boleh */}
            <Link href="/check-availability" className="flex items-center gap-3 hover:text-yellow-300">
              <MdHotel size={24} />
              <p>Cek Ketersediaan Kamar</p>
            </Link>

            {/* Logout */}
            <button
              onClick={() => router.post("/logout")}
              className="flex items-center gap-3 hover:text-yellow-300"
            >
              <LogOutIcon size={24} />
              <p>Logout</p>
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
