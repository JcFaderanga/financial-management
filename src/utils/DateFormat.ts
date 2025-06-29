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
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'Select Date';
  };