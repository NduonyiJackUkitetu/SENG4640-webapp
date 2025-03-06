document.addEventListener("DOMContentLoaded", () => {
    loadProducts(); // Load saved products

    // Get active user
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));

    // Show/hide "Add Product" button based on user role
    const addProductButton = document.getElementById("addProductButton");
    
    if (activeUser && activeUser.role === "owner") {
        addProductButton.style.display = "block";
        addProductButton.addEventListener("click", () => {
            window.location.href = "createProduct.html";
        });
    }

    // Log Out Button Functionality
    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("activeUser");
        alert("You have been logged out.");
        window.location.href = "login.html";
    });

    // Hamburger Menu Toggle Fix
    const menuToggle = document.getElementById("menuToggle");
    const menuContent = document.querySelector(".menu-content");
    
    menuToggle.addEventListener("click", () => {
        menuContent.classList.toggle("show"); // Toggle menu visibility
    });

    // Search Functionality
    document.getElementById("searchInput").addEventListener("input", searchProducts);

    // Event delegation for dynamically created buttons
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("modify-product")) {
            modifyProduct(event.target.dataset.index);
        } else if (event.target.classList.contains("delete-product")) {
            deleteProduct(event.target.dataset.index);
        } else if (event.target.classList.contains("buy-now")) {
            buyNow(event.target.dataset.index);
        } else if (event.target.classList.contains("add-to-cart")) {
            addToCart(event.target.dataset.index);
        }
    });
});

// Load Products
function loadProducts() {
    let storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    const defaultProducts = [
        { name: "Product 1", description: "Short description here.", price: "$19.99", image: "images/image-GPU-AMD.jpg" },
        { name: "Product 2", description: "Short description here.", price: "$19.99", image: "images/image-GPU-nvidia.jpeg" },
        { name: "Product 3", description: "Short description here.", price: "$39.99", image: "images/image-mouse.jpg" },
        { name: "Product 4", description: "Short description here.", price: "$39.99", image: "images/image-motherboard.jpg" }
    ];

    let allProducts = [...defaultProducts, ...storedProducts];

    let container = document.querySelector(".container");
    container.innerHTML = ""; // Clear old products

    allProducts.forEach((product, index) => {
        let productElement = document.createElement("div");
        productElement.classList.add("product");

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="product-info">
                <p>${product.description}</p>
                <div class="price">${product.price}</div>
                <div class="button-container">
                    <button class="buy-now" data-index="${index}">Buy Now</button>
                    <button class="add-to-cart" data-index="${index}">Add to Cart</button>
                    <button class="delete-product" data-index="${index}" style="display: none;">Delete Product</button>
                    <button class="modify-product" data-index="${index}" style="display: none;">Modify Product</button>
                </div>
            </div>
        `;

        container.appendChild(productElement);

        // Only show delete and modify button for owners
        const activeUser = JSON.parse(localStorage.getItem("activeUser"));
        if (activeUser && activeUser.role === "owner") {
            productElement.querySelector(".delete-product").style.display = "inline-block";
            productElement.querySelector(".modify-product").style.display = "inline-block";
        }
    });

    // Save updated product list in case it changes
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
}

// Delete Product Function (Only for Owner)
function deleteProduct(productIndex) {
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    
    if (!activeUser || activeUser.role !== "owner") {
        alert("You are not authorized to delete products.");
        return;
    }

    let storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    // Determine if the product to delete is a default product or a stored product
    if (productIndex >= 4) { // Only allow deleting stored products
        storedProducts.splice(productIndex - 4, 1);
        localStorage.setItem("products", JSON.stringify(storedProducts));
        loadProducts(); // Reload the product list
    } else {
        alert("Default products cannot be deleted.");
    }
}

// Modify Product Function (Redirects to Modify Page)
function modifyProduct(productIndex) {
    let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    if (!allProducts[productIndex]) return;

    localStorage.setItem("selectedProductIndex", productIndex); // Save selected product
    window.location.href = "modifyProduct.html"; // Redirect to modify page
}

// Add to Cart Function
function addToCart(productIndex) {
    let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    let product = allProducts[productIndex];

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
function buyNow(productIndex) {
    let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    let product = allProducts[productIndex];

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
