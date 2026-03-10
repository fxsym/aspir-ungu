import React from 'react'

export default function CenterScreen({children}) {
  return (
    <div className='min-h-screen justify-center items-center flex'>
      {children}
    </div>
  )
}
