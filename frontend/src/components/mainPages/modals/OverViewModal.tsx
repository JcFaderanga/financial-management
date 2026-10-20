import { useState } from "react";
import { FormatDate } from "@/utils/DateFormat";
import { datePropertyTypes } from "@/types/itemTypes";
type ModalProp={
    onChange: (date: string | datePropertyTypes)=> void;
}
const OverViewModal = ({onChange}:ModalProp) => {
    const[startDate, setStartDate] = useState<string>(String(FormatDate(new Date())))
    const[endDate, setEndDate] = useState<string>('')
    const[startTime, setStartTime] = useState<string>('')
    const[endTime, setEndTime] = useState<string>('')
    
    const submitFilter =()=>{
        const dates = {
            startDate:startDate,
            endDate:endDate,
            startTime: startTime,
            endTime: endTime
        }
        onChange(dates)
    }

return (
    <div className=' px-4 w-80 lg:w-96 mx-auto'>
        <section className="border px-4 py-2 rounded border-gray-200 my-1">
            <div className="">
                <label htmlFor="dateFrom" className="text-sm">Date From</label>
                <input 
                    id="dateFrom"
                    onChange={(date)=>setStartDate(date.target.value)} 
                    type='date' 
                    className='block w-full px-2 py-2 bg-slate-50 rounded cursor-pointer'
                />
            </div>
            <div>
                <label htmlFor="dateTo" className="text-sm">Date To</label>
                <input 
                    id="dateTo"
                    onChange={(date)=>setEndDate(date.target.value)} 
                    type='date' 
                    className='block w-full px-2 py-1 bg-slate-50 rounded cursor-pointer'
                />
            </div>
        </section>

        <section className="border px-4 p-2 rounded border-gray-200 my-1">
            <div>
                <label htmlFor="TimeFrom" className="text-sm">Time From</label>
                <input 
                    id="TimeFrom"
                    onChange={(time)=>setStartTime(time.target.value)} 
                    type='time' 
                    className='block w-full px-2 py-1 bg-slate-50 rounded cursor-pointer'
                />
            </div>
            <div>
                <label htmlFor="TimeTo" className="text-sm">Time To</label>
                <input 
                    id="TimeTo"
                    onChange={(time)=>setEndTime(time.target.value)} 
                    type='time' 
                    className='block w-full px-2 py-1 bg-slate-50 rounded cursor-pointer'
                />
            </div>
        </section>
        <button 
            onClick={submitFilter} 
            className="w-full py-2 border rounded my-4 border-slate-500">
                Okay
        </button>
    </div>
  )
}

export default OverViewModal