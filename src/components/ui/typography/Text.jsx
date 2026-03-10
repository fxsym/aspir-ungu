import React from 'react'

export default function Text({children, className}) {
  return (
    <p className={`text-md font-sans ${className}`}>
      {children}
    </p>
  )
}
