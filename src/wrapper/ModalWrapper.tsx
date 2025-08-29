import React from 'react'

const ModalWrapper = ({
  children, 
  close,
  className,
  classNameChild
}:{
  children: React.ReactNode,
  className?:string,
  classNameChild?:string,
  close?: ()=> void
}) => {

    /* use navigate(-1) to close the modal */
    
    React.useEffect(() => {
        // Disable scroll when modal is open
        if (children) {
          document.body.style.overflow = "hidden";
        }
        return () => {
          document.body.style.overflow = "";
        };
    }, [children]);

  return (
    <div
        onClick={close} 
        className={`${className} fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-9999 flex justify-center items-center transition-all`}>

          {/* to add animation: fade-in, slide-up */}
        <div onClick={(e)=>e.stopPropagation()} className={`${classNameChild} w-full max-w-2xl`}>
            {children}
        </div>
    </div>
  )
}

export default ModalWrapper
