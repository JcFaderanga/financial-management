import React from "react";
const SubmitButton = ({title, onClick, disabled, className}:{
    title: string,
    className?: string,
    onClick: ()=> void,
    disabled?: boolean
}) => {
  return (
    <button
    onClick={onClick}
    disabled = {disabled}
        className={`cursor-pointer w-full
        ${disabled ?'bg-gray-300 ' :'bg-blue-500'}
        ${className}
             px-4 py-2 rounded-xl text-white font-bold`}
    >{title}
    </button>
  )
}

export default React.memo(SubmitButton)