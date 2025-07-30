import React,{ ReactNode } from 'react'

const CustomRow = (
  {
    children,
    className,
    onClick
  }:{
    children: ReactNode,
    className?: string,
    onClick: () => void
  }) => {
  return (
    <tr onClick={onClick} className={`border-b border-gray-100 custom-black ${className ?? className}`}>
        {children}
    </tr>
  )
}

export default React.memo(CustomRow)