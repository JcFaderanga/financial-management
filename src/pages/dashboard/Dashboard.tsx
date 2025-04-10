import { useState } from "react"
import useDocumentTitle from "@/hooks/document/useDocTitle";
const Dashboard = () => {
const [count, setCount] = useState<number>(0);


useDocumentTitle('Dashboard | Finance Management')
 const counter = ()=>{
  setCount((count)=> count + 1)
  }
  return (
    <>
      <button onClick={counter}>add count</button>
      counts{count}
    </>
  )
}

export default Dashboard
