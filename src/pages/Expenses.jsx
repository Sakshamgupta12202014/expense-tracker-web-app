import React, { useEffect, useState } from "react";
// import authService from "../services/authService";
// import { login, logout } from "../store/userSlice";
import { useSelector } from "react-redux";

function Expenses() {
  const [msg, setMsg] = useState("");

  const isLoggedIn = useSelector((state) => state.isAuthenticated);

  
  useEffect(() => {
    if (isLoggedIn) {
      setMsg("Hurray, access to premium content");
    } else {
      setMsg("Sorry can show u anything, cause you are not logged in");
    }
  }, [isLoggedIn]);
  
  return (
    <>
      <div>
        <h2>{msg}</h2>
      </div>
    </>
  );
}

export default Expenses;
// moorkh ho tum agar tum abhi bhi nhi samjhe ki usestate func ko call krna outside effect will cause infinite re renders of the expenses page 

//   if(isLoggedIn){
//     setMsg("Hurray, access to premium content")
//   }else{
//     setMsg("Sorry can show u anything, cause you are not logged in");
//   }


// redundant checking ye toh tumahri app render hote hi check kar liya gaya tha aur redux store the isAuthenticated set kr diya gaya tha toh fir dobara is component mei check kyun krna

//   useEffect(() => {
//     authService
//       .getCurrentUser()
//       .then((userData) => {
//         if (userData) {
//             setMsg("Hurray, access to premium content")
//           dispatch(login({ userData }));
//         } else {
//             setMsg("Sorry can show u anything, cause you are not logged in");
//           dispatch(logout());
//         }
//       })
//       .catch(() => {
//         setUserFetchError("Error in fetching login details");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return <div><h2>{msg}</h2></div>;