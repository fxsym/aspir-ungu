'use client'
import { useState } from "react";
import Hero from "../ui/layout/Hero";
import Navmenu from "../ui/navbar/admin/Navmenu";
import Navbar from "../ui/navbar/admin/Navbar";


export default function MainLayout({ children, user }) {
    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <section className="flex">
            <Navmenu isOpen={showSidebar} onClose={() => setShowSidebar(false)} user={user} setShowSidebar={setShowSidebar}/>

            <div className="w-full transition-all duration-500">
                <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} user={user} />
                <Hero className={'min-h-0!'}>
                    {children}
                </Hero>
            </div>
        </section>
    )
}