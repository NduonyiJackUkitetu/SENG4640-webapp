document.addEventListener("DOMContentLoaded", () => {
    const productNameInput = document.getElementById("productName");
    const productDescriptionInput = document.getElementById("productDescription");
    const productPriceInput = document.getElementById("productPrice");
    const productImageInput = document.getElementById("productImage");
    const productForm = document.getElementById("productForm");

    // Retrieve selected product index
    const selectedProductIndex = parseInt(localStorage.getItem("selectedProductIndex"), 10);

    if (isNaN(selectedProductIndex)) {
        alert("No product selected for modification.");
        window.location.href = "mainpage.html";
        return;
    }

    // Retrieve all products (both default and user-added)
    const defaultProducts = [
        { name: "Product 1", description: "Short description here.", price: "$19.99", image: "images/image-GPU-AMD.jpg" },
        { name: "Product 2", description: "Short description here.", price: "$19.99", image: "images/image-GPU-nvidia.jpeg" },
        { name: "Product 3", description: "Short description here.", price: "$39.99", image: "images/image-mouse.jpg" },
        { name: "Product 4", description: "Short description here.", price: "$39.99", image: "images/image-motherboard.jpg" }
    ];
    
    let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    let allProducts = [...defaultProducts, ...storedProducts];

    // Check if the selected product index is valid
    if (selectedProductIndex < 0 || selectedProductIndex >= allProducts.length) {
        alert("Invalid product selected.");
        window.location.href = "mainpage.html";
        return;
    }

    let selectedProduct = allProducts[selectedProductIndex];

    // Populate the form fields with the existing product data
    productNameInput.value = selectedProduct.name;
    productDescriptionInput.value = selectedProduct.description;
    productPriceInput.value = selectedProduct.price.replace("$", ""); // Remove "$" sign
    productImageInput.value = selectedProduct.image;

    // Handle form submission
    productForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload

        // Update product details
        let updatedProduct = {
            name: productNameInput.value.trim(),
            description: productDescriptionInput.value.trim(),
            price: `$${parseFloat(productPriceInput.value).toFixed(2)}`,
            image: productImageInput.value.trim()
        };

        // Ensure modifications only apply to **stored products**, not hardcoded ones
        if (selectedProductIndex >= defaultProducts.length) {
            storedProducts[selectedProductIndex - defaultProducts.length] = updatedProduct;
            localStorage.setItem("products", JSON.stringify(storedProducts));
        } else {
            alert("You cannot modify default products!");
            return;
        }

        window.location.href = "mainpage.html"; // Redirect back to main page
    });
});
