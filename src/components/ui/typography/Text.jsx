import React from 'react'

export default function Text({ children, className, style }) {
  return (
    <p
      className={`text-md font-sans ${className}`}
      style={style}>
      {children}
    </p>
  )
}
