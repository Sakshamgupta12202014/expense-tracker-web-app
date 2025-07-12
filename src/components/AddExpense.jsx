import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import databaseService from "../services/expense";
import "./AddExpense.css"

function AddExpense() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formInputs, setFormInputs] = useState({});
  const [errors, setErrors] = useState({});

  const handleAdd = () => {
    // validate file
    const file = formInputs.receipt_image;
    if (!file) {
      alert("No file selected.");
      return false;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    // Max file size: 5 MB (adjust as needed)
    const maxSize = 5 * 1024 * 1024;

    // Type validation
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed.");
      setFormInputs((prevInputs) => ({ ...prevInputs, receipt_image: null }));
      return false;
    }

    // Size validation
    if (file.size > maxSize) {
      alert("File is too large. Max size is 5 MB.");
      setFormInputs((prevInputs) => ({ ...prevInputs, receipt_image: null }));
      return false;
    }

    console.log("Valid file selected:", file);
  };

  const handleChange = (e) => {
    const input = e.target.name;
    if (input !== "receipt_image") {
      inputValue = e.target.value;
    } else {
      inputValue = e.target.files[0];
    }

    setFormInputs((prevInputs) => ({ ...prevInputs, [input]: inputValue }));
  };

  return (
  <div className="add-expense">
    <h2 className="form-heading">Add New Expense</h2>
    <p className="form-subtext">Please fill out the details below to log your expense.</p>
    <p><span style={{color: "red"}}>*</span> represents required field</p>

    <form onSubmit={handleAdd}>
      <label>Amount <span style={{color: "red"}}>*</span></label>
      <input type="number" name="amount" placeholder="e.g. 250" required onChange={handleChange} />

      <label>Category <span style={{color: "red"}}>*</span></label>
      <select onChange={handleChange} value={formInputs.category} name="category" required>
        <option value="">Select category</option>
        <option value="food">Food & Dining</option>
        <option value="transportation">Transportation</option>
        <option value="health">Health & Medical</option>
        <option value="education">Education</option>
        <option value="travel">Travel & Leisure</option>
        <option value="bills&emi">Bills & EMI</option>
        <option value="entertainment">Entertainment</option>
        <option value="others">Others</option>
      </select>

      <label>Description <span style={{color: "red"}}>*</span></label>
      <textarea
        value={formInputs.description}
        placeholder="Describe this expense..."
        rows={4}
        cols={40}
        name="description"
        onChange={handleChange}
        required
      />

      <label>Date <span style={{color: "red"}}>*</span></label>
      <input type="date" name="date" value={formInputs.date} onChange={handleChange} required />

      <label>Payment Method <span style={{color: "red"}}>*</span></label>
      <input
        type="text"
        placeholder="e.g. Cash, UPI, Credit Card"
        name="payment_method"
        value={formInputs.payment_method}
        onChange={handleChange}
        required
      />

      <label>Location <span style={{color: "red"}}>*</span></label>
      <input
        type="text"
        name="location"
        placeholder="Where did you spend?"
        value={formInputs.location}
        onChange={handleChange}
        required
      />

      <label>Upload Receipt (JPG, PNG, or PDF)</label>
      <input
        type="file"
        name="receipt_image"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleChange}
        capture="environment"
      />

      <button type="submit">Add Transaction</button>
    </form>
  </div>
);

}

export default AddExpense;
