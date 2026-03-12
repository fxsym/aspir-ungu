import React from 'react'

export default function HeroText({children, className}) {
  return (
    <h1 className={`text-4xl font-sans text-primary font-bold sm:text-6xl md:text-8xl lg:text-9xl${className}`}>
      {children}
    </h1>
  )
}
