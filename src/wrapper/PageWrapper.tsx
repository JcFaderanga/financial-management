import React from 'react'

const PageWrapper = (
  {
    children, className
  }:{
    children: React.ReactNode, className?: string
  }) => {
  
  return (
    <main className={` ${className} w-full h-full mx-auto max-w-7xl`}>
        {children}
    </main>
  )
}

export default PageWrapper;
