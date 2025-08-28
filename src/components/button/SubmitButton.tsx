import React from "react";
import Spinner from "../UI/Spinner";
const SubmitButton = ({title, onClick, disabled, className, spinner}:{
    title: string,
    className?: string,
    onClick: ()=> void,
    disabled?: boolean,
    spinner?: boolean
}) => {
  return (
    <button
    onClick={onClick}
    disabled = {disabled}
        className={`cursor-pointer w-full
        ${disabled ?'bg-gray-300 ' :'bg-blue-500'}
        ${className}
             px-4 py-2 rounded-xl text-white font-bold`}
    >
      {
        !spinner ? title : <Spinner/> 
      }
    </button>
  )
}

export default React.memo(SubmitButton)