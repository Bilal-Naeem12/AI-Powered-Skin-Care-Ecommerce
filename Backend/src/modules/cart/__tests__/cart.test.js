const request = require("supertest");
const app = require("../../../app"); // Assuming you have your express app

describe("Cart Operations", () => {
    it("should add an item to the cart", async () => {
        const response = await request(app)
            .post("/api/cart/add")
            .send({
                userId: "user123",
                productId: "product123",
                quantity: 2,
                selectedVariant: "100ml",
            })
            .expect(200);
        expect(response.body.message).toBe("Item added to cart");
    });

    it("should remove an item from the cart", async () => {
        const response = await request(app)
            .delete("/api/cart/remove/user123/product123")
            .expect(200);
        expect(response.body.message).toBe("Item removed from cart");
    });

    it("should get the user's cart", async () => {
        const response = await request(app)
            .get("/api/cart/user123")
            .expect(200);
        expect(response.body.cart).toHaveProperty('items');
    });

    it("should checkout the cart", async () => {
        const response = await request(app)
            .post("/api/cart/checkout/user123")
            .expect(200);
        expect(response.body.message).toBe("Cart checked out successfully");
    });
});
