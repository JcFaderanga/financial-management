import { useState } from "react";
import { FormatDate } from "@/utils/DateFormat";
type ModalProp={
    onChange: (date: string | {})=> void;
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
    <div className='p-4 w-full '>
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
                <label htmlFor="dateFrom" className="text-sm">Date To</label>
                <input 
                    id="dateFrom"
                    onChange={(date)=>setEndDate(date.target.value)} 
                    type='date' 
                    className='block w-full px-2 py-1 bg-slate-50 rounded cursor-pointer'
                />
            </div>
        </section>

        <section className="border flex p-2 rounded border-gray-200 my-1">
            <div>
                <label htmlFor="dateFrom" className="text-sm">Time From</label>
                <input 
                    id="dateFrom"
                    onChange={(time)=>setStartTime(time.target.value)} 
                    type='time' 
                    className=' mx-1 py-1 bg-slate-50 rounded cursor-pointer'
                />
            </div>
            <div>
                <label htmlFor="dateFrom" className="text-sm">Time To</label>
                <input 
                    id="dateFrom"
                    onChange={(time)=>setEndTime(time.target.value)} 
                    type='time' 
                    className=' mx-1 py-1 bg-slate-50 rounded cursor-pointer'
                />
            </div>
        </section>
        <button onClick={submitFilter}>Okay</button>
        
    </div>
  )
}

export default OverViewModal