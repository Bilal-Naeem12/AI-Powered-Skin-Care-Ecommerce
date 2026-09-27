jest.mock("../modules/orders/orderModel", () => {
  const Model = jest.fn(function(data) { Object.assign(this,data); this.save = jest.fn().mockResolvedValue(this); });
  Model.withAll = jest.fn(); Model.findById = jest.fn(); return Model;
});
jest.mock("../modules/products/productModel", () => ({ findById: jest.fn() }));
jest.mock("../modules/payments/paymentModel", () => jest.fn(function(data) { Object.assign(this,data); this.save = jest.fn().mockResolvedValue(this); }));
jest.mock("../modules/shipping/shippingModel", () => jest.fn(function(data) { Object.assign(this,data); this.save = jest.fn().mockResolvedValue(this); }));
const mongoose = require("mongoose");
const Product = require("../modules/products/productModel");
const Order = require("../modules/orders/orderModel");
const Payment = require("../modules/payments/paymentModel");
const service = require("../modules/orders/orderService");
let session, input;
beforeEach(() => {
  jest.clearAllMocks();
  session = { startTransaction: jest.fn(), commitTransaction: jest.fn(), abortTransaction: jest.fn(), endSession: jest.fn() };
  jest.spyOn(mongoose,"startSession").mockResolvedValue(session);
  input = { userId: "507f1f77bcf86cd799439010", cartItems: [{ productId: "507f1f77bcf86cd799439011", quantity: 2, priceAtTimeOfOrder: 0.01 }], paymentPayload: { paymentGateway: "Cash on Delivery", paymentStatus: "Completed", amountPaid: 0.02 }, shippingAddress: { street: "Road", city: "City", state: "State", country: "Country", postal_code: "12345" } };
  Product.findById.mockReturnValue({ session: jest.fn().mockResolvedValue({ price: 25, variants: [{ size: "large", price: 40 }], adjustStock: jest.fn() }) });
  Order.withAll.mockResolvedValue({ _id: "order" });
});
afterEach(() => jest.restoreAllMocks());
test.each([0,-1,1.5,"2"])("rejects invalid quantity %s before starting transaction", async quantity => {
  input.cartItems[0].quantity = quantity;
  await expect(service.placeOrder(input)).rejects.toMatchObject({ status: 400 });
  expect(mongoose.startSession).not.toHaveBeenCalled();
});
test("checkout prices come from catalog and payment stays Pending", async () => {
  await service.placeOrder(input);
  expect(Order.mock.calls[0][0]).toMatchObject({ totalAmount: 50, cartItems: [{ priceAtTimeOfOrder: 25 }] });
  expect(Payment.mock.calls[0][0]).toMatchObject({ amountPaid: 50, paymentStatus: "Pending" });
  expect(session.commitTransaction).toHaveBeenCalledTimes(1);
});
test("variant price comes from catalog", async () => {
  input.cartItems[0].selectedVariant = "large";
  await service.placeOrder(input);
  expect(Order.mock.calls[0][0].totalAmount).toBe(80);
});
test("missing product aborts transaction", async () => {
  Product.findById.mockReturnValue({ session: jest.fn().mockResolvedValue(null) });
  await expect(service.placeOrder(input)).rejects.toMatchObject({ status: 404 });
  expect(session.abortTransaction).toHaveBeenCalled();
  expect(session.endSession).toHaveBeenCalled();
});
test("post-commit read failure does not abort a committed transaction", async () => {
  Order.withAll.mockRejectedValue(new Error("read failure"));
  await expect(service.placeOrder(input)).rejects.toThrow("read failure");
  expect(session.commitTransaction).toHaveBeenCalled();
  expect(session.abortTransaction).not.toHaveBeenCalled();
});
test("cannot cancel another customer's order", async () => {
  Order.findById.mockReturnValue({ session: jest.fn().mockResolvedValue({ userId: "owner" }) });
  await expect(service.cancelOrder({ orderId: "order", updatedBy: "someone-else" })).rejects.toMatchObject({ status: 403 });
  expect(session.abortTransaction).toHaveBeenCalled();
});
