
import { formatTo12Hour } from "../utils/DateFormat";
import { useOverviewDateStore } from "@/store/useOverviewDate";
import { format } from 'date-fns';

const OverviewDate = () => {
  const { date } = useOverviewDateStore();

  const formatToLocal = (dateInput: string | Date): string => {
    const localDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return format(localDate, 'MMMM d, yyyy'); // local browser time
  };

  let dateRange = String(new Date());
  let timeRange = '';

  if (date && typeof date === 'string') {
    // if it's a string and empty, fallback to now
    dateRange = formatToLocal(date);
  }

  if (typeof date === 'object') {
    const { startDate, endDate, startTime, endTime } = date;

    if (!startDate) {
      dateRange = formatToLocal(new Date());
    } else if (startDate && !endDate) {
      dateRange = formatToLocal(startDate);
    } else {
      dateRange = `${formatToLocal(startDate)} - ${formatToLocal(endDate)}`;
    }

    if (startTime && endTime) {
      timeRange = `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`;
    }
  }

  return { dateRange, timeRange };
};

export default OverviewDate;
