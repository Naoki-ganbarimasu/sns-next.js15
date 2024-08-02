import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
import { SendIcon } from './Icons'

const SubmitButton = () => {
    const {pending, data, method, action } = useFormStatus()
    console.log({pending, data, method ,action})
  return (
    <div>
        <Button variant="ghost" size="icon">
            <SendIcon className='h-5 w-5 tsxt-muted-foreground'/>
            <span className='sr-only'>Tweet</span>
        </Button>
      
    </div>
  )
}

export default SubmitButton
