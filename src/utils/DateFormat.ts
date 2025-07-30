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

  export function formatTo12Hour(time: string): string {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

