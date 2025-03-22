const Cart = require('./cartModel');
const Product = require('../products/productModel'); // Assuming you have a Product model

// **Add an item to the cart**
exports.addItemToCart = async (userId, productId, quantity, selectedVariant) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const cart = await Cart.findOne({ userId, isCheckedOut: false });
    if (!cart) {
        const newCart = new Cart({
            userId,
            items: [{ productId, quantity, selectedVariant, priceAtTimeOfAddition: product.price }],
        });
        return await newCart.save();
    } else {
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            cart.items.push({ productId, quantity, selectedVariant, priceAtTimeOfAddition: product.price });
        } else {
            cart.items[itemIndex].quantity += quantity; // Increase quantity
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.priceAtTimeOfAddition, 0);
        return await cart.save();
    }
};

// **Remove an item from the cart**
exports.removeItemFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ userId, isCheckedOut: false });
    if (!cart) throw new Error("Cart not found");

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) throw new Error("Item not found in cart");

    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.priceAtTimeOfAddition, 0);
    return await cart.save();
};

// **Get the cart for a user**
exports.getCart = async (userId) => {
    const cart = await Cart.findOne({ userId, isCheckedOut: false }).populate('items.productId');
    if (!cart) throw new Error("Cart not found");
    return cart;
};

// **Checkout the cart**
exports.checkoutCart = async (userId) => {
    const cart = await Cart.findOne({ userId, isCheckedOut: false });
    if (!cart) throw new Error("Cart not found");

    cart.isCheckedOut = true;
    await cart.save();
    return cart;
};
