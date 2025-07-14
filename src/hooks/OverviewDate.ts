import { LongDateFormat,formatTo12Hour } from "../utils/DateFormat";
import { useOverviewDateStore } from "@/store/useOverviewDate";

const OverviewDate = () => {
    const {date} = useOverviewDateStore();

    let dateRange = '';
    let timeRange = '';
    if (typeof date === 'object') {
        if(!date?.startDate){
            dateRange = LongDateFormat(new Date())
        }
        else if(date?.startDate && !date?.endDate){
          dateRange= LongDateFormat(new Date(date?.startDate));
        }
        else{
            dateRange =`${LongDateFormat(new Date(date?.startDate))} 
                - ${LongDateFormat(new Date(date?.endDate))}` 
        }

        if(date?.startTime && date?.endTime){
            timeRange = `${formatTo12Hour(date?.startTime)}
                - ${formatTo12Hour(date?.endTime)}` ;
        }
    }
  return {dateRange,timeRange}
}

export default OverviewDate;