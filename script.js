const services = [
    { name: "Long set", price: "£40", time: "2h 15m" },
    { name: "Medium set", price: "£35", time: "2h" },
    { name: "Short set", price: "£30", time: "1h 30m" },
    { name: "Acrylic overlay", price: "£30", time: "1h 30m" },
    { name: "XL set", price: "£45", time: "1h 30m" },
    { name: "XXL set", price: "£50", time: "1h 30m" },
    { name: "Acrylic toes", price: "£25", time: "1h 45m" },
    { name: "Gel toes", price: "£20", time: "1h 45m" },
    { name: "Acrylic Big Toes", price: "£10", time: "1h 30m" },
    { name: "Biab", price: "£25", time: "1h 30m" },
    { name: "Gel mani", price: "£25", time: "1h 15m" },
    { name: "freestyle", price: "£10", time: "1h" },
    { name: "recreation", price: "Email me", time: "1h" },
    { name: "Soak offs (my work)", price: "£10", time: "45m" },
    { name: "Soak offs (not my work)", price: "£15", time: "45m" },
    { name: "Infills", price: "£28", time: "1h 45m" },
    { name: "French nail", price: "£0", time: "15m" },
    { name: "Plain colour", price: "£0", time: "10m" },
    { name: "Charms", price: "£1 per nail", time: "—" },
    { name: "Drawn designs", price: "£0.50–£1 per nail", time: "10m" },
    { name: "Duck", price: "£5", time: "10m" },
    { name: "Almond", price: "£5", time: "10m" },
    { name: "Stilleto", price: "£5", time: "10m" },
    { name: "Chrome", price: "£1 per nail", time: "5m" },
  ];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function isInCart(service) {
  return cart.some(item => item.name === service.name);
}

function updateCartStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

  // Render all services on page
  const servicesContainer = document.getElementById("services-container");
  
  services.forEach(service => {
    const card = document.createElement("div");
    card.classList.add("service-card");
    card.innerHTML = `
      <h2>${service.name}</h2>
      <p>${service.price}</p>
    `;
    card.addEventListener("click", () => showPopup(service));
    servicesContainer.appendChild(card);
  });
  
  // Popup logic
  const popup = document.getElementById("popup");
  const popupName = document.getElementById("popup-name");
  const popupPrice = document.getElementById("popup-price");
  const popupTime = document.getElementById("popup-time");
  const popupClose = document.getElementById("popup-close");
  const addToBasketBtn = document.getElementById("add-to-basket");
  
  let currentServiceInPopup = null;

  function showPopup(service) {
    currentServiceInPopup = service;
    
    popupName.textContent = service.name;
    popupPrice.textContent = `Price: ${service.price}`;
    popupTime.textContent = `Time: ${service.time}`;
    popup.classList.remove("hidden");
    
    // Close popup
    popupClose.onclick = () => popup.classList.add("hidden");
    const inCart = isInCart(currentServiceInPopup);
    alert(inCart);
    alert(currentServiceInPopup.name)
    // Update button appearance
    if (inCart) {
        
      addToBasketBtn.textContent = "Added ✔";
      addToBasketBtn.classList.add("added");
    } else {
      addToBasketBtn.textContent = "Add to Basket";
      addToBasketBtn.classList.remove("added");
    }
  
    // Remove previous listener and add new one
    const newBtn = addToBasketBtn.cloneNode(true);
    addToBasketBtn.parentNode.replaceChild(newBtn, addToBasketBtn);
    
    newBtn.addEventListener("click", () => {
      const inCart = isInCart(currentServiceInPopup);
      
      if (inCart) {
        cart = cart.filter(item => item.name !== currentServiceInPopup.name);
        newBtn.textContent = "Add to Basket";
        newBtn.classList.remove("added");
      } else {
        cart.push(currentServiceInPopup);
        newBtn.textContent = "✔ Added";
        newBtn.classList.add("added");
      }
      updateCartStorage();
    });
  }

  // Search bar logic
  const input = document.getElementById("service-search");
  const suggestions = document.getElementById("suggestions");
  
  function findServiceByName(name) {
    return services.find(service => service.name.toLowerCase() === name.toLowerCase());
  }
  
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    suggestions.innerHTML = "";
    if (query.trim() === "") return;
  
    const matches = services.filter(service =>
      service.name.toLowerCase().includes(query)
    );
  
    matches.forEach(service => {
      const li = document.createElement("li");
      li.textContent = service.name;
      li.addEventListener("click", () => {
        input.value = service.name;
        suggestions.innerHTML = "";
        showPopup(service);
      });
      suggestions.appendChild(li);
    });
  
    if (matches.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No matching services";
      suggestions.appendChild(li);
    }
  });
  
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const match = findServiceByName(input.value.trim());
      if (match) {
        suggestions.innerHTML = "";
        showPopup(match);
      }
    }
  });
  
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.innerHTML = "";
  
      const match = findServiceByName(input.value.trim());
      if (match) showPopup(match);
    }
  });
  
  