document.addEventListener("DOMContentLoaded", () => {
    const fullNameInput = document.getElementById("fullName");
    const addressInput = document.getElementById("address");
    const cityInput = document.getElementById("city");
    const stateInput = document.getElementById("state");
    const zipInput = document.getElementById("zip");
    const roleInput = document.getElementById("role"); // Read-only field

    const saveButton = document.getElementById("saveChanges");
    const cancelButton = document.getElementById("cancelChanges");
    const logoutButton = document.getElementById("logoutButton");

    let activeUser = JSON.parse(localStorage.getItem("activeUser"));

    if (activeUser) {
        // Populate fields with current user data
        fullNameInput.value = activeUser.fullName;
        addressInput.value = activeUser.address;
        cityInput.value = activeUser.city;
        stateInput.value = activeUser.state;
        zipInput.value = activeUser.zip;
        roleInput.value = activeUser.role;
    } else {
        alert("No account found. Please log in.");
        window.location.href = "login.html"; // Redirect to login
    }

    // Save Changes Button
    saveButton.addEventListener("click", () => {
        activeUser.fullName = fullNameInput.value.trim();
        activeUser.address = addressInput.value.trim();
        activeUser.city = cityInput.value.trim();
        activeUser.state = stateInput.value.trim();
        activeUser.zip = zipInput.value.trim();

        localStorage.setItem("activeUser", JSON.stringify(activeUser));
        alert("Account details updated successfully!");
    });

    // Cancel Button - Revert changes
    cancelButton.addEventListener("click", () => {
        fullNameInput.value = activeUser.fullName;
        addressInput.value = activeUser.address;
        cityInput.value = activeUser.city;
        stateInput.value = activeUser.state;
        zipInput.value = activeUser.zip;

        window.location.href = "mainpage.html";
    });

    // Logout Button
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("activeUser");
        window.location.href = "login.html";
    });
});
