"use client"
import SectionOne from "./sections/SectionOne";
import { motion } from "framer-motion";
import SectionTwo from "./sections/SectionTwo";
import SectionThree from "./sections/SectionThree";
import SectionWorkflow from "./sections/SectionWorkflow";
import Hero from "@/components/ui/layout/Hero";
import HeroText from "@/components/ui/layout/HeroText";

export default function HomeContent({ totalIn = 0, totalResolved = 0, timelineData=[]}) {
    return (
        <Hero className="text-left items-start justify-start">
            <div className="w-full flex flex-col gap-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-10 pt-10"
                >
                    <HeroText className="text-left">ASPIR UNGU</HeroText>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <SectionOne 
                        totalIn={totalIn} 
                        totalResolved={totalResolved} 
                        timelineData={timelineData} 
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionTwo />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionWorkflow />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionThree />
                </motion.div>
                </div>
                </Hero>
                )
                }