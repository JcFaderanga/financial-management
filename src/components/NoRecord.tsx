
import { PiFilesLight } from "react-icons/pi";
export const NoRecord = () => {
  return (
    <div className="py-10 rounded-xl w-full bg-gray-200 dark:bg-medium-dark">
        <PiFilesLight size={40} className="mx-auto text-gray-400"/>
        <h1 className="text-sm text-center text-gray-400">No records</h1>
    </div>
  )
}
