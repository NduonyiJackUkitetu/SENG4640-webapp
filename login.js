document.addEventListener("DOMContentLoaded", () => {
    // Get form elements
    const loginForm = document.querySelector("form");
    const usernameInput = document.querySelector("input[type='text']");
    const passwordInput = document.querySelector("input[type='password']");
    const loginButton = document.querySelector(".login-btn");
    const createAccountButton = document.querySelector(".create-account-btn");

    // Handle login
    loginButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        const fullName = usernameInput.value.trim(); // Use Full Name as Username
        const password = passwordInput.value.trim();

        if (!fullName || !password) {
            alert("Please enter your full name and password.");
            return;
        }

        // Retrieve stored user data using Full Name
        const storedUser = JSON.parse(localStorage.getItem(fullName));

        if (storedUser && storedUser.password === password) {
            alert("Login successful! Redirecting...");
            window.location.href = "mainpage.html"; // Redirect to main page
        } else {
            alert("Invalid full name or password.");
        }
    });

    // Redirect to Create Account Page
    createAccountButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission
        window.location.href = "createAccount.html"; // Redirect to create account page
    });
});
