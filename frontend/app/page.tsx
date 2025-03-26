"use client";
import Dashboard from "./dashboard/page"
import {useEffect} from 'react'
export default function Home() {
  let userID =1;
  useEffect(() => {
    if (typeof window !== "undefined") {
      userID = (parseInt(localStorage.getItem("user_id") || "1"));
    }
}, []);
  return (
    <Dashboard/>
  )
}

