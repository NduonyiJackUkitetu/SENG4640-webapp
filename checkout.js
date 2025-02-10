document.addEventListener("DOMContentLoaded", () => {
  // Handle form submission
  document.getElementById("checkoutForm").addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Get form values
      const fullName = document.getElementById("fullName").value.trim();
      const address = document.getElementById("address").value.trim();
      const city = document.getElementById("city").value.trim();
      const state = document.getElementById("state").value.trim();
      const zip = document.getElementById("zip").value.trim();
      const cardName = document.getElementById("cardName").value.trim();
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const expiryDate = document.getElementById("expiryDate").value.trim();
      const cvv = document.getElementById("cvv").value.trim();

      // Validate required fields
      if (!fullName || !address || !city || !state || !zip || !cardName || !cardNumber || !expiryDate || !cvv) {
          alert("Please fill in all fields.");
          return;
      }

      // Validate ZIP code (Only numbers, min length 5)
      if (!/^\d{5,}$/.test(zip)) {
          alert("Please enter a valid ZIP code (at least 5 digits).");
          return;
      }

      // Validate Card Number (16 digits)
      if (!/^\d{16}$/.test(cardNumber)) {
          alert("Please enter a valid 16-digit card number.");
          return;
      }

      // Validate Expiry Date (MM/YY format)
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
          alert("Please enter a valid expiry date in MM/YY format.");
          return;
      }

      // Validate CVV (3-4 digits)
      if (!/^\d{3,4}$/.test(cvv)) {
          alert("Please enter a valid CVV (3 or 4 digits).");
          return;
      }

      // Simulate order processing (In real apps, integrate with payment gateway)
      alert("Order submitted successfully!");
      localStorage.removeItem("cart"); // Clear cart after successful order
      window.location.href = "index.html"; // Redirect to main page
  });
});

  