import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import AddExpense from "../components/AddExpense";
import "./Expenses.css";
import databaseService from "../services/expense";

function Expenses() {
  // const [msg, setMsg] = useState("");
  // const isLoggedIn = useSelector((state) => state.isAuthenticated);
  // const expense = useSelector((state) => state.expenses)
  const user_Id = useSelector((state) => (state.user ? state.user.$id : null));
  // console.log(user_Id);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // fetch all the expenses of the logged in user as soon as the components mounts
    const fetchExpenses = async () => {
      if (!user_Id) return; // Wait until we actually have a user ID
      // console.log(user_Id);
      const res = await databaseService.getExpenses(user_Id);
      setExpenses(res.documents);
    };

    fetchExpenses(); // Call the function
  }, [user_Id]);
  

  return (
    <>
      <div className="expense-page">
        <div className="expense-nav">
          <h1>Transaction </h1>
          <Link to="/addExpense">
            <button className="create-expense">Create</button>
          </Link>
        </div>

        <div className="expenses">
          {expenses &&
            expenses.map((expense) => {
              return (
                <div key={expense.expense_Id} className="expense">
                  <div className="expense-field">{expense.amount} ₹</div>
                  <div className="expense-field">{expense.category}</div>
                  <div className="expense-field">{expense.description}</div>
                  <div className="expense-field">{expense.date}</div>
                  <div className="expense-field">{expense.payment_method}</div>
                  <div className="expense-field">{expense.location}</div>
                  {expenses.receipt_image && (
                    <button className="view-receipt-btn">View Receipt</button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Expenses;

// {/* <p style={{margin: "0px"}}>{expense.length}</p> */}
// {/* <AddExpense /> */}

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
