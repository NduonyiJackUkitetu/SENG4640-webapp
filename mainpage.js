document.addEventListener("DOMContentLoaded", () => {
    // Event listener for search functionality
    document.getElementById("searchInput").addEventListener("input", searchProducts);

    // Event listeners for "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", addToCart);
    });

    // Event listeners for "Buy Now" buttons
    document.querySelectorAll(".buy-now").forEach(button => {
        button.addEventListener("click", buyNow);
    });

    // Event listener for cart button
    document.getElementById("cartButton").addEventListener("click", showCart);
});

// Search Functionality
function searchProducts() {
    let searchQuery = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let title = product.querySelector("h3").textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            product.style.display = "block"; // Show matching products
        } else {
            product.style.display = "none"; // Hide non-matching products
        }
    });
}

// Add to Cart Functionality
function addToCart(event) {
    let product = event.target.closest(".product");
    let productName = product.querySelector("h3").textContent;
    let productPrice = product.querySelector(".price").textContent;
    let productImage = product.querySelector("img").src;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product is already in the cart
    let existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${productName} added to cart!`);
}

// "Buy Now" Functionality (Redirects to Checkout)
function buyNow(event) {
    let product = event.target.closest(".product");
    let productName = product.querySelector("h3").textContent;
    let productPrice = product.querySelector(".price").textContent;
    let productImage = product.querySelector("img").src;

    // Replace cart with only this product (so checkout page has only this item)
    let cart = [{
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    }];

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`Proceeding to checkout with ${productName}.`);
    window.location.href = "checkout.html"; // Redirect to checkout page
}

// Show Cart Functionality
function showCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let cartContent = "Your Cart:\n\n";
    cart.forEach(item => {
        cartContent += `${item.name} - ${item.price} x ${item.quantity}\n`;
    });

    alert(cartContent);
}
