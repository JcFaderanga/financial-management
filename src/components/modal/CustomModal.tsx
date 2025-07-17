import { ReactNode,useEffect } from "react"
import { FaXmark } from "react-icons/fa6";
const CustomModal = ({children, hidden, onClick}: {children: ReactNode,hidden: boolean, onClick?: ()=> void}) => {

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
        className={`${hidden ? 'fixed' : 'hidden'}
         w-full px-4 h-screen bg-[rgb(0,0,0,.3)] top-0 left-0 flex justify-center items-center`}>
        <div className=" bg-white rounded ">
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