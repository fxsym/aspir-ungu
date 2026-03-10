import React from 'react'
import Text from '../typography/Text'

export default function MainButton({children}) {
  return (
    <button className='bg-primary p-3 rounded-full hover:cursor-pointer'>
      <Text className={"text-background"}>{children}</Text>
    </button>
  )
}
