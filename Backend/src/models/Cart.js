const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"]
            },
            selectedVariant: {
                type: String, // Example: "50ml", "100ml"
                default: null
            },
            priceAtTimeOfAddition: {
                type: Number,
                required: true // Captures price at the time item was added to cart
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    isCheckedOut: {
        type: Boolean,
        default: false // Indicates if cart has been converted into an order
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// **Auto-calculate total price before saving**
CartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((total, item) => total + item.quantity * item.priceAtTimeOfAddition, 0);
    next();
});

module.exports = mongoose.model("Cart", CartSchema);
