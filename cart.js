const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.getElementById('cart-items');

cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name}</span><span>£${item.price}</span>`;
    cartItemsContainer.appendChild(li);
});

document.getElementById('checkout-btn').addEventListener('click', async () => {
    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ items: cart })
    });
    const session = await response.json();
    const stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Replace
    stripe.redirectToCheckout({ sessionId: session.id });
});
