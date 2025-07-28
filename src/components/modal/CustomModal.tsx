import { ReactNode,useEffect } from "react"
import { FaXmark } from "react-icons/fa6";
const CustomModal = ({children, hidden, onClick}: {children: ReactNode,hidden: boolean, onClick?: ()=> void}) => {

     useEffect(() => {
    // Disable scroll
    if(hidden){
        document.body.style.overflow = "hidden";
    }
  
    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [hidden]);

  return (
    <section
        className={`${hidden ? 'fixed' : ' hidden'}
         w-full px-4 h-screen bg-[rgb(0,0,0,.3)] inset-0 overflow-scroll`}>
        <div className=" bg-white rounded mt-4 max-w-200 mx-auto">
            <div onClick={onClick} className="p-2 flex justify-end cursor-pointer ">
              <FaXmark size={20} className="text-slate-500"/>
            </div>
            <div>
              {children} 
            </div>
        </div>
    </section>
  )
}

export default CustomModal