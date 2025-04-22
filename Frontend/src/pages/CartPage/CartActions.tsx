import React from "react";
import Button from "../../component/UI/Button";
import { Link } from "react-router-dom";

const CartActions = () => {
  return (
    <div className="flex justify-between items-center mt-6">
      <Link to="/shop" style={{ textDecoration: "none" }}>
        <Button variant="black" className="px-6 py-3">
          Return To Shop
        </Button>
      </Link>
      <Link to="/checkout-page" style={{ textDecoration: "none" }}>
        <Button variant="secondary" className="px-6 py-3">
        Proceed to Checkout
      </Button>
      </Link>
    </div>
  );
};

export default CartActions;
