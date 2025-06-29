import React from 'react'

export const SubmitButton = ({onClick, disabled}:{
    onClick: ()=> void,
    disabled: boolean
}) => {
  return (
    <button
    onClick={onClick}
    disabled = {disabled}
        className={`cursor-pointer w-full
        ${disabled ?'bg-gray-300 ' :'bg-blue-500'}
             px-4 py-2 rounded-xl text-white font-bold`}
    >Save
    </button>
  )
}
