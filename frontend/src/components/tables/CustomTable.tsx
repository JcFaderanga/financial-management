import { ReactNode } from 'react'

const CustomTable = ({children, className}: {children: ReactNode, className?: string}) => {
  return (
    <table className={`w-full ${className ?? className}`}>
        {children}
    </table>
  )
}


export default CustomTable;