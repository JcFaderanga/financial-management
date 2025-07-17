export type itemTypes={
    id?: string | number,
    owner?: string,
    title?: string,
    price?: number | string,
    category?: string,
    location?: string,
    grouped_in?: string | number ,
    created_at?: any,
}
export type datePropertyTypes={
  startDate: string, 
  endDate: string,
  startTime?: string,
  endTime?: string,
}