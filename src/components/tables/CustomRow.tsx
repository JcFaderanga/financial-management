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
    <tr onClick={onClick} className={` ${className ?? className}`}>
        {children}
    </tr>
  )
}

export default React.memo(CustomRow)