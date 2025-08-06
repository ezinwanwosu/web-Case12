document.addEventListener('DOMContentLoaded', () => {
  const cartList = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  const totalTimeEl = document.getElementById('total-time');
  const checkoutBtn = document.getElementById('checkout-btn');
  const appointmentEl = document.getElementById('appointment');
  const displayAppointment = document.getElementById("AppointmentTag");

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartDisplay() {
    cartList.innerHTML = '';
    let totalPrice = 0;
    let totalTime = 0;
    let date = localStorage.getItem("selectedDate");
    let time = localStorage.getItem("selectedTime");

    if (cart.length === 0) {
      cartList.innerHTML = '<li>Your cart is empty.</li>';
      checkoutBtn.style.display = 'none';
      totalPriceEl.textContent = '0.00';
      totalTimeEl.textContent = '0 mins';
      return;
    }

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
        <strong>${item.name}</strong>
        ${item.price}
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;

      cartList.appendChild(li);

      const priceNum = parseFloat(item.price.replace(/[^\d.]/g, ""));
      if (!isNaN(priceNum)) totalPrice += priceNum;

      const timeMatch = item.time.match(/(\d+)h(?:\s*(\d+)m)?|(\d+)m/);
      if (timeMatch) {
        if (timeMatch[1]) {
          const h = parseInt(timeMatch[1]) || 0;
          const m = parseInt(timeMatch[2]) || 0;
          totalTime += h * 60 + m;
        } else if (timeMatch[3]) {
          totalTime += parseInt(timeMatch[3]);
        }
      }
    });

    totalPriceEl.textContent = ` £${totalPrice.toFixed(2)}`;
    totalTimeEl.textContent = ` ${totalTime} mins`;
    displayAppointment.style.display = 'block';
    appointmentEl.textContent = `${date} ${time}`;
    checkoutBtn.style.display = 'block';
  }

  cartList.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    }
  });

  checkoutBtn.addEventListener('click', async () => {
    const date = localStorage.getItem("selectedDate");
    const time = localStorage.getItem("selectedTime");
    console.log("Checkout clicked")
    const data = {
      appointment_date: `${date} ${time}`
    };

    try {
      const res = await fetch("https://yoncesacrylicss.onrender.com/store-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to store booking');

      localStorage.removeItem('cart');
      localStorage.removeItem('selectedDate');
      localStorage.removeItem('selectedTime');

      // Redirect to Stripe
      window.location.href = "https://buy.stripe.com/eVqdR93nd2Ptfes3lO6wE00";
    } catch (err) {
      alert('Error saving booking. Please try again.');
      console.error(err);
    }
  });

  updateCartDisplay();
});
