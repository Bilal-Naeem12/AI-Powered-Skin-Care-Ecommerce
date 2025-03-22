const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app"); // Import your Express app

// Load Discount model and service
const Discount = require("../discountModel");
const { calculateDiscount } = require("../discountUtils");

describe("Discount Module Tests", () => {
  beforeAll(async () => {
    // Connect to an in-memory MongoDB for testing
    const mongoURI = process.env.MONGODB_URI_TEST; // You can use an in-memory database or local DB for tests
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Clean up and disconnect after tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Optional: Clean the database before each test to avoid state leakage between tests
    await Discount.deleteMany({});
  });

  // **🔹 Test Case: Create Discount**
  it("should create a new discount", async () => {
    const discountData = {
      code: "DISCOUNT2021",
      description: "Test Discount",
      discountType: "Percentage",
      discountValue: 10,
      minOrderAmount: 50,
      startDate: new Date(),
      endDate: new Date(),
    };

    const response = await request(app)
      .post("/api/discount/create")
      .send(discountData)
      .expect(201);

    expect(response.body.message).toBe("Discount created successfully");
    expect(response.body.discount.code).toBe("DISCOUNT2021");
    expect(response.body.discount.discountValue).toBe(10);
  });

  // **🔹 Test Case: Get Discount by Code**
  it("should get a discount by code", async () => {
    const discountData = {
      code: "DISCOUNT2021",
      description: "Test Discount",
      discountType: "Percentage",
      discountValue: 10,
      minOrderAmount: 50,
      startDate: new Date(),
      endDate: new Date(),
    };

    const createdDiscount = await Discount.create(discountData);

    const response = await request(app)
      .get(`/api/discount/${createdDiscount.code}`)
      .expect(200);

    expect(response.body.code).toBe("DISCOUNT2021");
    expect(response.body.discountValue).toBe(10);
  });

  // **🔹 Test Case: Get All Active Discounts**
  it("should return all active discounts", async () => {
    const discountData = {
      code: "DISCOUNT2021",
      description: "Test Discount",
      discountType: "Percentage",
      discountValue: 10,
      minOrderAmount: 50,
      startDate: new Date(),
      endDate: new Date(),
    };

    await Discount.create(discountData);

    const response = await request(app).get("/api/discount").expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].code).toBe("DISCOUNT2021");
  });

  // **🔹 Test Case: Apply Discount to Order**
  it("should apply a discount to an order", async () => {
    const discountData = {
      code: "DISCOUNT2021",
      description: "Test Discount",
      discountType: "Percentage",
      discountValue: 10,
      minOrderAmount: 50,
      startDate: new Date(),
      endDate: new Date(),
    };

    const createdDiscount = await Discount.create(discountData);
    const orderAmount = 100;

    const response = await request(app)
      .post("/api/discount/apply")
      .send({ discountCode: createdDiscount.code, orderAmount })
      .expect(200);

    const expectedAmountAfterDiscount = orderAmount - (discountData.discountValue / 100) * orderAmount;
    expect(response.body.totalAmount).toBe(expectedAmountAfterDiscount);
  });

  // **🔹 Test Case: Invalid Discount Code**
  it("should return an error for an invalid discount code", async () => {
    const response = await request(app)
      .post("/api/discount/apply")
      .send({ discountCode: "INVALIDCODE", orderAmount: 100 })
      .expect(400);

    expect(response.body.error).toBe("Invalid or expired discount");
  });

  // **🔹 Test Case: Discount Validation Utility**
  it("should validate the discount calculation correctly", () => {
    const discount = {
      discountType: "Percentage",
      discountValue: 10,
      maxDiscountAmount: 20,
    };

    const orderAmount = 150;
    const discountApplied = calculateDiscount(discount, orderAmount);
    expect(discountApplied).toBe(15); // 10% of 150 = 15 (maxDiscountAmount doesn't apply here)

    const discount2 = {
      discountType: "Percentage",
      discountValue: 20,
      maxDiscountAmount: 15,
    };
    const discountApplied2 = calculateDiscount(discount2, orderAmount);
    expect(discountApplied2).toBe(15); // 20% of 150 = 30, but maxDiscountAmount is 15
  });
});
