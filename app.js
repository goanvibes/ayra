// --- 1. Menu Data (Based on Provided Prompt) ---
const menuData = [
    {
        category: "Signature Specials",
        items: [
            { id: "s1", name: "Chicken Dum Biryani", price: 100 },
            { id: "s2", name: "Mutton Dum Biryani", price: 210 },
            { id: "s3", name: "Egg Biryani", price: 100 },
            { id: "s4", name: "Prawns Biryani", price: 160 }
        ]
    },
    {
        category: "Mutton & Goan Specialties",
        items: [
            { id: "m1", name: "Mutton Khima", price: 230 },
            { id: "m2", name: "Mutton Sukha", price: 230 },
            { id: "m3", name: "Mutton Xacuti", price: 220 },
            { id: "m4", name: "Chicken Xacuti", price: 130 },
            { id: "m5", name: "Chicken Sukha", price: 130 },
            { id: "m6", name: "Goan Chicken Chilli", price: 130 }
        ]
    },
    {
        category: "Indian Vegetarian (Main Course)",
        items: [
            { id: "v1", name: "Dal Fry", price: 100 },
            { id: "v2", name: "Dal Tadaka", price: 120 },
            { id: "v3", name: "Paneer (Masala/Makhani/Kadai)", price: 140 },
            { id: "v4", name: "Veg Kadai", price: 140 },
            { id: "v5", name: "Mix Veg", price: 130 },
            { id: "v6", name: "Mushroom Masala", price: 130 },
            { id: "v7", name: "Mix Veg Kolhapuri", price: 130 }
        ]
    },
    {
        category: "Non-Vegetarian (Chicken/Egg)",
        items: [
            { id: "n1", name: "Chicken (Masala/Kadai/Kolhapuri)", price: 150 },
            { id: "n2", name: "Egg Masala", price: 100 },
            { id: "n3", name: "Mutton Kadai/Masala", price: 220 }
        ]
    },
    {
        category: "Chinese & Starters",
        items: [
            { id: "c1", name: "Paneer/Mushroom Chilli", price: 130 },
            { id: "c2", name: "Veg/Gobi Manchurian", price: 130 },
            { id: "c3", name: "Noodles (Veg/Chicken)", price: 120 }
        ]
    },
    {
        category: "Rice & Noodles",
        items: [
            { id: "r1", name: "Fried Rice (Veg/Paneer/Chicken/Egg)", price: 130 },
            { id: "r2", name: "Schezwan Variants (+10)", price: 140 },
            { id: "r3", name: "Plain Rice", price: 60 },
            { id: "r4", name: "Jira Rice", price: 70 },
            { id: "r5", name: "Veg Pulav", price: 90 }
        ]
    }
];

// --- 2. Navigation Logic ---
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0,0);
}

// --- 3. Image Selection Modal ---
let selectedImageUrl = '';

function selectImage(index, title, imageUrl) {
    selectedImageUrl = imageUrl;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalImage').src = imageUrl;
    document.getElementById('imageModal').style.display = 'block';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function copyImageUrl() {
    if (selectedImageUrl) {
        navigator.clipboard.writeText(selectedImageUrl).then(() => {
            alert('✅ Image URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            prompt('Copy this image URL:', selectedImageUrl);
        });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// --- 4. Render Menus ---
function renderMenus() {
    const displayContainer = document.getElementById('menu-container');
    const orderContainer = document.getElementById('order-menu-container');
    
    let displayHTML = '';
    let orderHTML = '';

    menuData.forEach(cat => {
        // For Display Menu
        displayHTML += `<div class="menu-category"><h3>${cat.category}</h3>`;
        // For Order Menu
        orderHTML += `<div class="menu-category"><h3>${cat.category}</h3>`;

        cat.items.forEach(item => {
            // Display Item
            displayHTML += `
                <div class="menu-item">
                    <span>${item.name}</span>
                    <span class="menu-item-price">₹${item.price}</span>
                </div>`;
            
            // Order Item (With + / - buttons)
            orderHTML += `
                <div class="menu-item">
                    <span>${item.name} <br><small>₹${item.price}</small></span>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateCart('${item.id}', '${item.name}', ${item.price}, -1)">−</button>
                        <span id="qty-${item.id}">0</span>
                        <button class="qty-btn" onclick="updateCart('${item.id}', '${item.name}', ${item.price}, 1)">+</button>
                    </div>
                </div>`;
        });
        displayHTML += `</div>`;
        orderHTML += `</div>`;
    });

    displayContainer.innerHTML = displayHTML;
    orderContainer.innerHTML = orderHTML;
}

// --- 5. Cart & WhatsApp Logic ---
let cart = {};

function updateCart(id, name, price, change) {
    if (!cart[id]) {
        cart[id] = { name: name, price: price, qty: 0 };
    }
    
    cart[id].qty += change;
    if (cart[id].qty < 0) cart[id].qty = 0;
    
    // Update quantity display
    document.getElementById(`qty-${id}`).innerText = cart[id].qty;
    
    if (cart[id].qty === 0) {
        delete cart[id];
    }
    
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    cartList.innerHTML = '';
    let total = 0;

    for (const id in cart) {
        const item = cart[id];
        const itemTotal = item.qty * item.price;
        total += itemTotal;
        cartList.innerHTML += `<li>${item.qty}x ${item.name} <span>₹${itemTotal}</span></li>`;
    }

    if (Object.keys(cart).length === 0) {
        cartList.innerHTML = '<li style="text-align: center; color: #999;">Your cart is empty</li>';
    }

    totalEl.innerText = total;
}

function sendWhatsAppOrder() {
    // >>> REPLACE THIS WITH THE RESTAURANT'S ACTUAL WHATSAPP NUMBER (include country code, no +) <<<
    const WHATSAPP_NUMBER = "919876543210"; 

    if (Object.keys(cart).length === 0) {
        alert("❌ Please add items to your cart before ordering.");
        return;
    }

    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;

    if (!name || !phone || !address) {
        alert("❌ Please fill in your name, phone, and address.");
        return;
    }

    let message = `*🍛 NEW ORDER FOR AYRA 🍛*
\n`;
    message += `*📋 Customer Details:*
`;
    message += `👤 Name: ${name}\n`;
    message += `📱 Phone: ${phone}\n`;
    message += `📍 Address/Table: ${address}\n\n`;
    message += `*🛍️ Order Items:*
`;

    let total = 0;
    for (const id in cart) {
        const item = cart[id];
        const itemTotal = item.qty * item.price;
        total += itemTotal;
        message += `• ${item.qty}x ${item.name} - ₹${itemTotal}\n`;
    }

    message += `\n💰 *Total Amount:* ₹${total}\n\n`;
    message += `⏰ *Estimated Time:* 30-45 minutes\n`;
    message += `✨ _Thank you for choosing AYRA !_\n`;
    message += `🔥 _Enjoy your meal !_`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
}

// Initialize application on load
window.onload = () => {
    renderMenus();
    renderCart();
};