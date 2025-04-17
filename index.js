const products = [
    { id: 1, name: "Iphone 12 128GB", price: 45500, image: "12.jpg" },
    { id: 2, name: "HP Elitebook 840 G7", price: 58880, image: "hp.png" },
    { id: 3, name: "Oraimo Free Pods Lite", price: 1790, image: "pods2.jpg" },
    { id: 4, name: "Oraimo Watch 4 Plus", price: 4950, image: "watch.jpg" },
    { id: 5, name: "Samsung Galaxy A36", price: 42570, image: "a36.jpg" },
    { id: 6, name: "Samsung 25W Charger", price: 2350, image: "adapter.jpg" },
    { id: 7, name: "Playstation 5", price: 67800, image: "5.jpg" },
    { id: 8, name: "Samsung 65 Inch TV", price: 119990, image: "qled.jpg" },
    { id: 9, name: "Hisense Soundbar 340W", price: 26660, image: "bar.png" },
    { id: 10,name:  "Samsung 530L Refrigerator", price:142990, image:"530.jpg"},
    { id: 11, name: "MIKA Gas Cooker", price:35680, image:"mika.jpg"},
    { id: 12, name: "Oraimo Wireless Clippers", price:2700,image:"clippers.jpg"}
];

const productGrid = document.getElementById("product-grid");
const cartItemsList = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout");

let cart = [];


function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}" style="max-width: 150px;">
            <h3>${product.name}</h3>
            <p>Ksh ${product.price.toLocaleString()}</p>
            <button class="button" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join("");
}


function addToCart(productId) {
    const item = cart.find(c => c.id === productId);
    if (item) {
        item.quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateCartCount();
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsList.innerHTML = "<li>Your cart is empty.</li>";
        cartTotalDisplay.textContent = "Total: Ksh 0";
    } else {
        cartItemsList.innerHTML = cart.map(item => `
            <li>
                ${item.name} x ${item.quantity} — Ksh ${(item.price * item.quantity).toLocaleString()}
                <button class="button" onclick="removeFromCart(${item.id})">Remove</button>
            </li>
        `).join("");

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalDisplay.textContent = `Total: Ksh ${total.toLocaleString()}`;
    }
}


function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}


function generateReceipt() {
    let receipt = `
    <html>
        <head>
            <title>Receipt</title>
            <style>
                body { font-family: sans-serif; }
                .receipt { width: 300px; margin: 20px auto; border: 1px solid #ddd; padding: 20px; }
                .receipt h2 { text-align: center; }
                .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .total { margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="receipt">
                <h2>Bei Bora Receipt</h2>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Time: ${new Date().toLocaleTimeString()}</p>
                <hr>
    `;

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receipt += `
            <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>Ksh ${itemTotal.toLocaleString()}</span>
            </div>
        `;
        total += itemTotal;
    });

    receipt += `
                <hr>
                <div class="total">
                    <span>Total:</span>
                    <span>Ksh ${total.toLocaleString()}</span>
                </div>
            </div>
        </body>
    </html>
    `;

    return receipt;
}

// Checkout event listener
checkoutButton.addEventListener("click", () => {
    if (cart.length > 0) {
        const receiptWindow = window.open("", "Receipt", "width=400,height=600");
        receiptWindow.document.write(generateReceipt());
        receiptWindow.document.close();
        cart = [];
        renderCart();
    } else {
        alert("Your cart is empty.");
    }
});

renderProducts();
renderCart();
