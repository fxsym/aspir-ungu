'use client'
import MainButton from '@/components/ui/button/MainButton';
import FormInput from '@/components/ui/form/FormInput';
import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText';
import { motion } from "framer-motion";
import React from 'react'
import { useForm } from 'react-hook-form';

export default function LoginContent() {

    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }

    return (
        <Hero>
            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <HeroText>ASPIR UNGU</HeroText>
                <HeroText>LOGIN ADMIN</HeroText>
            </motion.div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='sm:w-90 md:w-100 lg:w-120 flex flex-col  text-left gap-2 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl'
            >
                <div className='w-full lg:flex lg:justify-around lg:gap-4 '>
                    <div className='lg:w-120'>
                        <FormInput
                            register={register}
                            name='user_info'
                            label='Username / Email'
                            placeholder='Masukan username / email'
                        />

                        <FormInput
                            register={register}
                            name='password'
                            label='Password'
                            placeholder='Masukan password'
                            type='password'
                        />
                    </div>
                </div>

                <MainButton type='submit' className='w-full'>Login</MainButton>

            </form>
        </Hero>
    )
}
