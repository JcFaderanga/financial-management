import React,{ ReactNode } from 'react'

const CustomData = ({children, className}: {children: ReactNode, className?: string}) => {
  return (
    <td className={`py-3 truncate max-w-[150px] overflow-hidden whitespace-nowrap ${className ?? className}`}>
        {children}
    </td>
  )
}
export default React.memo(CustomData);