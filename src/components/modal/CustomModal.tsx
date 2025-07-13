import { ReactNode,useEffect } from "react"

const CustomModal = ({children, onClick}: {children: ReactNode, onClick?: ()=> void}) => {

     useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  return (
    <section
        className="w-full px-4 h-screen fixed bg-[rgb(0,0,0,.3)] top-0 left-0 flex justify-center items-center">
        <div className="w-full bg-white rounded ">
            <div onClick={onClick} className="cursor-pointer">Close</div>
              {children}  
        </div>
    </section>
  )
}

export default CustomModal