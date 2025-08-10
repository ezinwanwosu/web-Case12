// Categorize your services
const acrylicSets = [
    { name: "Long set", price: "£40", time: "2h 15m" },
    { name: "Medium set", price: "£35", time: "2h" },
    { name: "Short set", price: "£30", time: "1h 30m" },
    { name: "Acrylic overlay", price: "£30", time: "1h 30m" },
    { name: "XL set", price: "£45", time: "1h 30m" },
    { name: "XXL set", price: "£50", time: "1h 30m" },
  ];
  
  const toes = [
    { name: "Acrylic toes", price: "£25", time: "1h 45m" },
    { name: "Gel toes", price: "£20", time: "1h 45m" },
    { name: "Acrylic Big Toes", price: "£10", time: "1h 30m" },
  ];
  
  const manicures = [
    { name: "Biab", price: "£25", time: "1h 30m" },
    { name: "Gel mani", price: "£25", time: "1h 15m" },
  ];
  
  const soakOffs = [
    { name: "Soak offs (my work)", price: "£10", time: "45m" },
    { name: "Soak offs (not my work)", price: "£15", time: "45m" },
    { name: "Infills", price: "£28", time: "1h 45m" },
  ];
  
  const addOns = [
    { name: "Freestyle", price: "£10", time: "1h" },
    { name: "Recreation", price: "Email me", time: "1h" },
    { name: "French nail", price: "£0", time: "15m" },
    { name: "Plain colour", price: "£0", time: "10m" },
    { name: "Charms", price: "£1 per nail", time: "—" },
    { name: "Drawn designs", price: "£0.50–£1 per nail", time: "10m" },
    { name: "Duck", price: "£5", time: "10m" },
    { name: "Almond", price: "£5", time: "10m" },
    { name: "Stilleto", price: "£5", time: "10m" },
    { name: "Chrome", price: "£1 per nail", time: "5m" },
  ];
  
  // Cart handling as before
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  function updateCartStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  // Utility to create service cards in a container
  function createServiceCards(services, containerId, clickable=true) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    services.forEach(service => {
      const card = document.createElement("div");
      card.classList.add("service-card");
      card.setAttribute("tabindex", "0"); // accessible keyboard focus
      card.innerHTML = `<h2>${service.name}</h2><h3>${service.price}</h3>`;
      if (clickable) {
        card.addEventListener("click", () => openServicePopup(service));
        card.addEventListener("keypress", e => { if(e.key === "Enter") openServicePopup(service); });
      }
      container.appendChild(card);
    });
  }
  
  // Show popup logic
  const popup = document.getElementById("popup");
  const popupName = document.getElementById("popup-name");
  const popupPrice = document.getElementById("popup-price");
  const popupTime = document.getElementById("popup-time");
  const popupClose = document.getElementById("popup-close");
  const addToBasketBtn = document.getElementById("add-to-basket");
  const addonsFieldset = document.getElementById("addons-fieldset");
  const addonsList = document.getElementById("addons-list");
  const showMoreBtn = document.getElementById("show-more-addons");
  
  let currentService = null;
  let selectedAddOns = new Set();
  let addonsShownCount = 3; // Show 3 add-ons initially
  
  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
    clearAddons();
  });
  
  function clearAddons() {
    addonsList.innerHTML = "";
    selectedAddOns.clear();
    addonsFieldset.classList.add("hidden");
    showMoreBtn.classList.add("hidden");
    addonsShownCount = 3;
  }
  
  function openServicePopup(service) {
    currentService = service;
    popupName.textContent = service.name;
    popupPrice.textContent = `Price: ${service.price}`;
    popupTime.textContent = `Time: ${service.time}`;
    
    // Show add-ons ONLY for acrylicSets, toes, manicures
    if (
      acrylicSets.find(s => s.name === service.name) ||
      toes.find(s => s.name === service.name) ||
      manicures.find(s => s.name === service.name)
    ) {
      renderAddons();
      addonsFieldset.classList.remove("hidden");
    } else {
      clearAddons();
    }
    
    popup.classList.remove("hidden");
  }
  
  // Render add-ons checkboxes with show more toggle
  function renderAddons() {
    addonsList.innerHTML = "";
  
    let toShow = addOns.slice(0, addonsShownCount);
    toShow.forEach(addon => {
      const id = `addon-${addon.name.replace(/\s+/g, '-')}`;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.name = "addons";
      checkbox.value = addon.name;
      
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) selectedAddOns.add(addon);
        else selectedAddOns.delete(addon);
      });
      
      const label = document.createElement("label");
      label.htmlFor = id;
      label.textContent = `${addon.name} (${addon.price})`;
      
      const wrapper = document.createElement("div");
      wrapper.classList.add("addon-option");
      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      addonsList.appendChild(wrapper);
    });
  
    // Show "Show more" button if there are more add-ons
    if (addOns.length > addonsShownCount) {
      showMoreBtn.classList.remove("hidden");
      showMoreBtn.textContent = "Show more";
    } else {
      showMoreBtn.classList.add("hidden");
    }
  }
  
  showMoreBtn.addEventListener("click", () => {
    addonsShownCount = addOns.length; // Show all
    renderAddons();
    showMoreBtn.classList.add("hidden");
  });
  
  // Add to basket with add-ons
  addToBasketBtn.addEventListener("click", () => {
    if (!currentService) return;
    
    // Create a combined service with add-ons included in name and price/time calculation
    const combinedName = `${currentService.name} + ${[...selectedAddOns].map(a => a.name).join(", ")}`;
    
    // Combine prices and times - for simplicity, just keep main price and list add-ons in name
    // You can extend to parse and sum price/time if you want
    
    const combinedService = {
      name: combinedName,
      price: currentService.price,
      time: currentService.time,
    };
    
    cart.push(combinedService);
    updateCartStorage();
    
    alert("Added to basket: " + combinedName);
    popup.classList.add("hidden");
    clearAddons();
  });
  
  // Initialize all sections
  createServiceCards(acrylicSets, "acrylic-sets-container");
  createServiceCards(toes, "toes-container");
  createServiceCards(manicures, "manicures-container");
  createServiceCards(soakOffs, "soak-offs-container");
  
  // Optional: You can add styles for mobile and popup in CSS
  