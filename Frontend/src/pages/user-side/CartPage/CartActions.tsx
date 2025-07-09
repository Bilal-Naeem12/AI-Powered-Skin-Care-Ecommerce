import React from "react";
import Button from "../../../component/UI/Button";
import { Link } from "react-router-dom";
import useUserStore from "@/store/UserStore";
import useCartStore from "@/store/CartStore";

const CartActions = () => {
const {isCartEmpty} = useCartStore()
  return (
    <div className="flex sm:flex-row flex-col gap-5 justify-between items-center mt-6">
      <Link to="/shop" style={{ textDecoration: "none" }} className="w-full sm:w-fit">
        <Button variant="black" className="px-6 py-3 w-full sm:w-fit">
          Return To Shop
        </Button>
      </Link>
    {isCartEmpty() ? (
        <Button variant="secondary" disabled className="px-6 py-3 w-full sm:w-fit opacity-50 cursor-not-allowed">
          Cart is Empty
        </Button>
      ) : (
        <Link to="/checkout-page" style={{ textDecoration: "none" }} className="w-full sm:w-fit">
          <Button variant="secondary" className="px-6 py-3 w-full sm:w-fit">
            Proceed to Checkout
          </Button>
        </Link>
      )}
    </div>
  );
};

export default CartActions;
