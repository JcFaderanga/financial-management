//2025-08-01 
export const FormatDate=(date: any)=>{
  const setDate = new Date(date);
  const yyyy = setDate.getFullYear()
  const mm = String(setDate.getMonth() + 1).padStart(2, '0')
  const dd = String(setDate.getDate()).padStart(2, '0')

  return `${yyyy}-${mm}-${dd}`;
 }
 
 
 export const DayAndDate =(inputDate: any)=> {
    if (!inputDate) {
      return "Date not valid";
    }
    const date = new Date(inputDate);
  
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', 
      month: 'long',   
      day: 'numeric'   
    });
  
    return formatter.format(date); 
  }

  export const LongDateFormat = (date: any) => {
    return date ? date.toLocaleDateString('en-US', { 
      timeZone: 'UTC',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'Select Date';
  };

  export function formatTo12Hour(time: string) {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

//2025-08-01 04:53:29.122000+00
export function FormattedUTCDate(date: string | Date) {
  
  const selectedDate = FormatDate(date)

  if(selectedDate === "NaN-NaN-NaN") return 'invalid date';
  
  const now = new Date();

  const pad = (n:any, width = 2) => String(n).padStart(width, '0');
  const hours = pad(now.getUTCHours());
  const minutes = pad(now.getUTCMinutes());
  const seconds = pad(now.getUTCSeconds());
  const milliseconds = now.getUTCMilliseconds();
  const microseconds = pad(milliseconds * 1000, 6); 

  const formatedDate = `${selectedDate} ${hours}:${minutes}:${seconds}.${microseconds}+00`;

  return formatedDate;
}


export function MonthToNumber(month: string): number | undefined {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ];
  const index = months.indexOf(month.toLowerCase());
  return index >= 0 ? index + 1 : undefined;
}

