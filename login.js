document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const createAccountButton = document.getElementById("createAccountButton");

    // Handle Login
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            return;
        }

        // Retrieve stored user data
        const storedUser = JSON.parse(localStorage.getItem(username));

        if (storedUser && storedUser.password === password) {
            localStorage.setItem("activeUser", JSON.stringify(storedUser)); // Save active user
            window.location.href = "mainpage.html";
        } else {
            alert("Invalid username or password.");
        }
    });

    // Redirect to Create Account Page
    createAccountButton.addEventListener("click", () => {
        window.location.href = "createAccount.html";
    });
});
