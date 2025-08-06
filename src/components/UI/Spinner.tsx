import { ClipLoader } from "react-spinners";

const Spinner = () => {
  return (

     <div className='flex justify-center w-full h-screen py-20 dark:text-white'>
        <span className='dark:hidden'><ClipLoader size={30} /></span>
        <span className='hidden dark:block'><ClipLoader color={'#ffffff'} size={30} /></span>
      </div>
  ) 
}
export default Spinner;
