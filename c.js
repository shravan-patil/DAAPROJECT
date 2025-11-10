let cart = [];

function addToCart(item) {
    const existing = cart.find(i => i.part === item.part && i.category === item.category);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...item, quantity: 1});
    }
    alert(`${item.part} added to your cart`);
    updateCart();
}

function removeFromCart(index){
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if(cart.length === 0){
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartItems.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <div>${item.part} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</div>
            <button class="checkout-btn" onclick="removeFromCart(${idx})">Remove</button>
        </div>
    `).join('') + `
        <div class="cart-total"><strong>Total: $${total.toFixed(2)}</strong></div>
        <button class="checkout-btn" onclick="checkout()">Checkout</button>
    `;
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function checkout() {
    if(cart.length === 0) return;
    alert(`Thank you for your order! Total: $${cart.reduce((sum, item) => sum + (item.price*item.quantity),0).toFixed(2)}`);
    cart = [];
    updateCart();
    toggleCart();
}
