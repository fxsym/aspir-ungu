import React from 'react'

export default function Title({children, className}) {
  return (
    <h1 className={`text-2xl font-sans text-accent ${className}`}>
      {children}
    </h1>
  )
}
