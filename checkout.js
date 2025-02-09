// Handle form submission
document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // In production, you would process the order and integrate with a backend/payment gateway.
    alert('Order submitted successfully!');
  });
  