// "use client";
// import Dashboard from "./dashboard/page"
// import Login from "./pages/login"
// import {useEffect} from 'react'
// export default function Home() {
//   let userID =1;
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       userID = (parseInt(localStorage.getItem("user_id") || "1"));
//     }
// }, []);
//   return (
//     <Dashboard/>
//   )
// }

// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userID = localStorage.getItem("user_id");
    if (userID) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null; // hoặc loading indicator
}
