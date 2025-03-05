document.addEventListener("DOMContentLoaded", () => {
    loadProducts(); // Load saved products

    // Get active user
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));

    // Check user role and show/hide "Add Product" button
    const addProductButton = document.getElementById("addProductButton");
    if (activeUser && activeUser.role === "owner") {
        addProductButton.style.display = "block"; // Show button for owners
        addProductButton.addEventListener("click", () => {
            window.location.href = "createProduct.html";
        });
    }

    document.getElementById("searchInput").addEventListener("input", searchProducts);
    document.getElementById("cartButton").addEventListener("click", showCart);
});

// Load Products
function loadProducts() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let container = document.querySelector(".container");
    container.innerHTML = "";

    const defaultProducts = [
        { name: "Product 1", description: "Short description here.", price: "$19.99", image: "images/image-GPU-AMD.jpg" },
        { name: "Product 2", description: "Short description here.", price: "$19.99", image: "images/image-GPU-nvidia.jpeg" },
        { name: "Product 3", description: "Short description here.", price: "$39.99", image: "images/image-mouse.jpg" },
        { name: "Product 4", description: "Short description here.", price: "$39.99", image: "images/image-motherboard.jpg" }
    ];

    let allProducts = [...defaultProducts, ...products];

    allProducts.forEach(product => {
        let productElement = document.createElement("div");
        productElement.classList.add("product");

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="product-info">
                <p>${product.description}</p>
                <div class="price">${product.price}</div>
                <div class="button-container">
                    <button class="buy-now">Buy Now</button>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;

        container.appendChild(productElement);

        productElement.querySelector(".add-to-cart").addEventListener("click", () => addToCart(product));
        productElement.querySelector(".buy-now").addEventListener("click", () => buyNow(product));
    });
}

// Add to Cart Functionality
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

// "Buy Now" Functionality (Redirects to Checkout)
function buyNow(product) {
    let cart = [{ ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
}

// Search Products
function searchProducts() {
    let searchQuery = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let title = product.querySelector("h3").textContent.toLowerCase();
        product.style.display = title.includes(searchQuery) ? "block" : "none";
    });
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
