import React, { useState } from "react";

function RazorpayPayment() {
  const [amount, setAmount] = useState("");

  const loadRazorpay = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const options = {
      key: "rzp_test_1234567890", // Replace with your Razorpay Key ID
      amount: amount * 100,       // Convert ₹ to paise
      currency: "INR",
      name: "Expense Tracker",
      description: "Add Expense",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

        // Save payment as expense
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.push({ id: response.razorpay_payment_id, amount: parseFloat(amount) });
        localStorage.setItem("expenses", JSON.stringify(expenses));
      },
      prefill: {
        name: "Saksham Gupta",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      <input
        type="number"
        placeholder="Enter Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={loadRazorpay}>Pay</button>
    </div>
  );
}

export default RazorpayPayment;
