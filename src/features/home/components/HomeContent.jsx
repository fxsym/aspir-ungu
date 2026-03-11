"use client"
import SectionOne from "./sections/SectionOne";
import Hero from "./Hero";
import OrganizationLogo from "@/components/ui/OrganizationLogo";
import HeroText from "./HeroText";
import Text from "@/components/ui/typography/Text";
import MainButton from "@/components/ui/button/MainButton";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionTwo from "./sections/SectionTwo";
import SectionThree from "./sections/SectionThree";

export default function HomeContent() {
    const [current, setCurrent] = useState(0)

    const next = () => {
        if (current < steps.length - 1) {
            setCurrent(current + 1)
        }
    }

    const steps = [
        <SectionOne next={next} />,
        <SectionTwo next={next} />,
        <SectionThree next={next} />,
    ]

    return (
        <Hero>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <HeroText>ASPIR UNGU</HeroText>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="rounded"
                >
                    {steps[current]}
                </motion.div>
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <OrganizationLogo></OrganizationLogo>
            </motion.div>
        </Hero>
    )
}