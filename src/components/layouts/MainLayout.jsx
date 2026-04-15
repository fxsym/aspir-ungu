import { useState } from "react";
import Navmenu from "./Navmenu";
import Navbar from "./Navbar";
import Hero from "../ui/layout/Hero";

export default function MainLayout({ children, user }) {
    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <section className="flex">
            <Navmenu isOpen={showSidebar} onClose={() => setShowSidebar(false)} user={user} />

            <div className="w-full transition-all duration-500">
                <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} user={user} />
                <Hero className={'min-h-0!'}>
                    {children}
                </Hero>
            </div>
        </section>
    )
}