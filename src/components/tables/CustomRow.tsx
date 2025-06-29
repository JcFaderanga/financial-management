import { ReactNode } from 'react'

const CustomRow = ({children, className}: {children: ReactNode, className?: string}) => {
  return (
    <tr className={`border-b border-gray-100 custom-black ${className ?? className}`}>
        {children}
    </tr>
  )
}

export default CustomRow