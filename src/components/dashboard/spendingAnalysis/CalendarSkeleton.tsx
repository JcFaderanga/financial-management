import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from 'date-fns';
import { useThisMonth } from '@/store/useCalendarStore';

const CalendarSkeleton = () => {
  const { currentMonth } = useThisMonth();
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const monthStartDay = getDay(startOfMonth(currentMonth));
  const daysWithOffset = Array(monthStartDay).fill(null).concat(days);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {/* Title */}
        <div className={` text-sm font-bold text-dark bg-gray-200 dark:bg-light-dark rounded-full h-3 w-32`} />

        {/* Header */}
        <div className="flex items-center gap-1">
          <button className={`  px-1 bg-gray-200 dark:bg-light-dark rounded-md cursor-pointer h-7 w-7`} />
          <div className={`  bg-gray-200 dark:bg-light-dark rounded-md h-7 w-18 lg:w-30`} />
          <button className={`  px-1 bg-gray-200 dark:bg-light-dark rounded-md cursor-pointer h-7 w-7`} />
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-hidden md:h-auto">
        <div className="grid grid-cols-7 gap-2 mt-4">
          {/* Day Header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className={`  py-1 h-6 rounded-lg bg-gray-200 dark:text-white dark:bg-light-dark`}
            />
          ))}

          {/* Calendar Body */}
          {daysWithOffset.map((date, idx) => (
            <div
              key={idx}
              className={`${
                date ? `  dark:bg-light-dark bg-gray-200` : 'bg-transparent border-none'
              } h-12 md:h-24 rounded-xl`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSkeleton;
