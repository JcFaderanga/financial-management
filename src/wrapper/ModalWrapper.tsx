import React from 'react'

const ModalWrapper = ({children, close}:{children: React.ReactNode, close: ()=> void}) => {

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
        className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-9999 flex justify-center items-center px-4`}>
        <div onClick={(e)=>e.stopPropagation()} className=' w-full max-w-2xl'>
            {children}
        </div>
    </div>
  )
}

export default ModalWrapper
