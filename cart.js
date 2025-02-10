document.addEventListener("DOMContentLoaded", loadCart);

// Redirect to main page when clicking "Continue Shopping"
document.getElementById("continueShoppingButton").addEventListener("click", () => {
    window.location.href = "mainpage.html";
});

// Load Cart Items
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("checkoutButton").disabled = true; // Disable checkout if cart is empty
        return;
    }

    cartContainer.innerHTML = "";
    
    cart.forEach((item, index) => {
        let itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
        totalPrice += itemTotal;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    document.getElementById("cart-total").textContent = `$${totalPrice.toFixed(2)}`;
}

// Update Quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// Remove Item
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// Checkout (Redirects to checkout page)
document.getElementById("checkoutButton").addEventListener("click", () => {
    if (JSON.parse(localStorage.getItem("cart"))?.length === 0) {
        alert("Your cart is empty. Add items before proceeding to checkout.");
        return;
    }

    alert("Proceeding to checkout!");
    window.location.href = "checkout.html"; // Redirect to checkout page
});
