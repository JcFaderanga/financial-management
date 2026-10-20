import { ReactNode } from 'react'

const CustomHeader = ({children, className}: {children: ReactNode, className?: string}) => {
  return (
    <th className={`text-left font-semibold px-4 ${className ?? className}`}>
        {children}
    </th>
  )
}
export default CustomHeader;