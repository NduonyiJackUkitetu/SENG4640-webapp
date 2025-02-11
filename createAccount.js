document.addEventListener("DOMContentLoaded", () => {
    // Get form element
    const createAccountForm = document.getElementById("createAccountForm");

    // Handle form submission
    createAccountForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page refresh

        // Get form values
        const fullName = document.getElementById("fullName").value.trim();
        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const zip = document.getElementById("zip").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim(); // Fixed ID

        console.log("Form Submitted:", { fullName, address, city, state, zip, password, confirmPassword });

        // Validate required fields
        if (!fullName || !address || !city || !state || !zip || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Validate ZIP code (Only numbers, min length 5)
        const zipRegex = /(^\d{5}$)|(^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$)/;
        if (!zipRegex.test(zip)) {
            alert("Please enter a valid ZIP/Postal Code (5-digit ZIP or A1B2C3 format).");
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Check if user already exists
        if (localStorage.getItem(fullName)) {
            alert("An account with this name already exists. Please use a different name.");
            return;
        }

        // Store user data in localStorage
        const userData = {
            fullName,
            address,
            city,
            state,
            zip,
            password
        };

        localStorage.setItem(fullName, JSON.stringify(userData));

        window.location.href = "login.html"; // Redirect to login page
    });
});

