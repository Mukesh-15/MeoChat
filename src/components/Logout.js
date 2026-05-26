import React, { use , useEffect} from 'react'

export default function Logout() {
    localStorage.removeItem("token");
    useEffect(() => {
        window.location.href = "/login";
      }, []);
  return (
    <div>
      loged out!
    </div>
  )
}
