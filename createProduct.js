document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");

    productForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload

        // Get user inputs
        const productName = document.getElementById("productName").value.trim();
        const productDescription = document.getElementById("productDescription").value.trim();
        const productPrice = document.getElementById("productPrice").value.trim();
        const productImage = document.getElementById("productImage").value.trim();

        if (!productName || !productDescription || !productPrice || !productImage) {
            alert("Please fill in all fields.");
            return;
        }

        // Validate Image URL (Basic Check)
        if (!productImage.startsWith("http")) {
            alert("Please enter a valid image URL.");
            return;
        }

        // Retrieve existing products from localStorage
        let products = JSON.parse(localStorage.getItem("products")) || [];

        // Create new product object
        let newProduct = {
            name: productName,
            description: productDescription,
            price: `$${parseFloat(productPrice).toFixed(2)}`,
            image: productImage
        };

        // Add new product to array
        products.push(newProduct);

        // Save updated products list to localStorage
        localStorage.setItem("products", JSON.stringify(products));

        alert("Product added successfully!");

        // Redirect to main page
        window.location.href = "mainpage.html";
    });
});
