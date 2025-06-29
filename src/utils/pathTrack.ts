import useDocumentTitle from "@/hooks/document/useDocTitle";
// import { useLocation } from "react-router-dom";


const isDashboard = location.pathname === '/dashboard';
document.title = 'isDashboard';
// console.log("location",isDashboard)
// useDocumentTitle(isDashboard ? "PATH PASSED" : 'FAILED')