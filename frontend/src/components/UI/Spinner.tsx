import { ClipLoader } from "react-spinners";

const Spinner = () => {
  return (

     <div className=' dark:text-white w-full '>
        <span className='dark:hidden'><ClipLoader size={20} color="#f8fafc" className="text-blue-400"/></span>
        <span className='hidden dark:block'><ClipLoader size={20} color={'#ffffff'} /></span>
      </div>
  ) 
}
export default Spinner;
