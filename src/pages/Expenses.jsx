import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Expenses.css";
import databaseService from "../services/expense";
import AddExpense from "../components/AddExpense";
import LoadingAnimation from "../components/LoadingAnimation";

import { toast } from "react-toastify";

function Expenses() {
  const navigate = useNavigate();
  const [user, setuser] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showForm]);

  useEffect(() => {
    const fetchUser = async () => {
      const User = await authService.getCurrentUser();
      if (!User) {
        toast.info("Log in to add expense");
        navigate("/login");
      }
      setuser(User);
    };

    fetchUser();

    // fetch all the expenses of the logged in user as soon as the components mounts
    const fetchExpenses = async () => {
      if (!user.$id) return;
      const res = await databaseService.getExpenses(user.$id);
      setExpenses(res.documents);
      setLoading(false);
    };

    fetchExpenses(); // Call the function
  }, [user.$id, expenses]);

  //************UPLOAD FILE***********************************/

  // user wants to upload file
  const [file, setFile] = useState("");

  const uploadReceipt = async (expense) => {
    // validate if user has choosen a file
    if (!file) {
      toast.info("Please, choose a file !");
      return false;
    }
    setLoading(true);

    let receiptUrl = "";

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    // validate choosen file type
    if (file && !validTypes.includes(file.type)) {
      toast.info(
        "Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed."
      );
      return false;
    }

    const uploadReceipt = await databaseService.uploadFile(file);
    if (uploadReceipt) {
      toast.success("receipt uploaded successfully");
      // console.log("file uploaded : ", uploadReceipt);
    }
    receiptUrl = databaseService.getFilePreview(uploadReceipt.$id);
    console.log("Url of image : ", receiptUrl);

    // call update service of the appwrite
    const newExpense = {
      ...expense,
      receipt_image: receiptUrl || "",
      receipt_id: uploadReceipt ? uploadReceipt.$id : "",
    };

    try {
      const updatedExpense = await databaseService.updateExpense(
        expense.expense_Id,
        newExpense
      );
      if (updatedExpense) {
        setLoading(false);
        toast.success("Uploaded receipt succesfully");
      }
    } catch (error) {
      toast.error("Something went wrong while uploading receipt", error);
      // console.log("Error in uploading receipt: ", error);
    }
  };

  const deleteReceipt = async (expense) => {
    // call update service of the appwrite database
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this receipt?"
    );

    if (confirmDelete) {
      try {
        if (expense.receipt_id) {
          const deleted = await databaseService.deleteFile(expense?.receipt_id);
          if (deleted) {
            // also delete from database

            // now call update service
            const newExpense = {
              ...expense,
              receipt_image: "",
              receipt_id: "",
            };

            try {
              const updatedExpense = await databaseService.updateExpense(
                expense.expense_Id,
                newExpense
              );
              if (updatedExpense) {
                toast.info("Note: receipt deleted !!");
              }
            } catch (error) {
              toast.error("Something went wrong while updating expense");
              // console.log("Error in updating expense: ", error);
            }
          }
        } else {
          toast.info(
            "Cannot delete current expense's receipt image(No receipt_id)"
          );
        }
      } catch (error) {
        toast.error("Somethig went wrong while deleting file", error);
        // console.log("Error in deleting file from storage: ", error);
      }
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddExpense closeForm={() => setShowForm(false)} />
          </div>
        </div>
      )}
      <div className={`expenses-wrapper ${showForm ? "blurred" : ""}`}>
        <div className="expense-page">
          <div className="expense-nav">
            <h1>Transaction </h1>
            {/* <Link to="/addExpense"> */}
            <button
              className="create-expense"
              onClick={() => setShowForm(true)}
            >
              Create
            </button>
            {/* </Link> */}
          </div>

          <div className="expenses">
            {expenses &&
              expenses.map((expense) => {
                return (
                  <div key={expense.expense_Id} className="expense-card">
                    <div className="expense-row">
                      <span className="expense-label">Amount:</span>
                      <span className="expense-value">{expense.amount} ₹</span>
                    </div>
                    <div className="expense-row">
                      <span className="expense-label">Category:</span>
                      <span className="expense-value">{expense.category}</span>
                    </div>
                    <div className="expense-row">
                      <span className="expense-label">Description:</span>
                      <span className="expense-value">
                        {expense.description}
                      </span>
                    </div>
                    <div className="expense-row">
                      <span className="expense-label">Date:</span>
                      <span className="expense-value">{expense.date}</span>
                    </div>
                    <div className="expense-row">
                      <span className="expense-label">Payment:</span>
                      <span className="expense-value">
                        {expense.payment_method}
                      </span>
                    </div>
                    <div className="expense-row">
                      <span className="expense-label">Location:</span>
                      <span className="expense-value">{expense.location}</span>
                    </div>

                    {expense.receipt_image !== "" ? (
                      <div className="expense-actions">
                        <a href={expense.receipt_image} target="_blank">
                          <button className="view-receipt-btn">
                            View Receipt
                          </button>
                        </a>
                        <button
                          className="view-receipt-btn"
                          onClick={() => deleteReceipt(expense)}
                        >
                          Delete Receipt
                        </button>
                      </div>
                    ) : (
                      <div className="expense-actions">
                        <input
                          type="file"
                          name="receipt_image"
                          className="choose-file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button
                          className="view-receipt-btn"
                          onClick={() => uploadReceipt(expense)}
                        >
                          Upload Receipt
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
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

// check only logged in user can access this page
// if(!user_Id){
//   alert("log in to see expenses")
//   navigate("/login")
// }

// const [msg, setMsg] = useState("");
// const isLoggedIn = useSelector((state) => state.isAuthenticated);
// const expense = useSelector((state) => state.expenses)

// const user_Id = useSelector((state) => (state.user ? state.user.$id : null));
// console.log(user_Id);
