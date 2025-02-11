// checkout.js

document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();

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

        // Validate ZIP/Postal Code
        const zipRegex = /(^\d{5}$)|(^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$)/;
        if (!zipRegex.test(zip)) {
            alert("Please enter a valid ZIP/Postal Code (5-digit ZIP or A1B2C3 format). ");
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
            alert("Please enter a valid CVV (3 or 4 digits). ");
            return;
        }

        // Simulate order processing
        alert("Order submitted successfully!");
        localStorage.removeItem("cart"); // Clear cart after order
        window.location.href = "mainpage.html"; // Redirect to main page
    });

    // Handle "Return To Shopping" button separately
    let returnButton = document.querySelector(".return-to-shopping");
    if (returnButton) {
        returnButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent form submission
            window.location.href = "mainpage.html";
        });
    }
});

// Function to display cart items on checkout page
function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("checkout-cart-items");
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartContainer.innerHTML = "";
    cart.forEach(item => {
        let itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
        totalPrice += itemTotal;

        cartContainer.innerHTML += `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
                <div class="checkout-item-details">
                    <h2 class="checkout-item-title">${item.name}</h2>
                    <p class="checkout-item-description">Quantity: ${item.quantity}</p>
                    <p class="checkout-item-price">Price: ${item.price}</p>
                    <p class="checkout-item-subtotal">Subtotal: $${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    });

    let totalContainer = document.getElementById("checkout-total");
    if (totalContainer) {
        totalContainer.innerHTML = `<h2>Total (incl. tax): $${totalPrice.toFixed(2)}</h2>`;
    }
}
