// store/useOrderStore.ts
import { create } from "zustand";
import type { Order } from "@/types/Order";

type OrderDraft = Omit<Order, "userId"> & { userId: string | Order["userId"] };
type OrderStore = {
  order: OrderDraft;
  setOrder: (update: Partial<OrderDraft>) => void;
  resetOrder: () => void;
};

const useOrderStore = create<OrderStore>((set) => ({
  order: {
    _id: "",
    orderNumber: "",
    userId: "",
    cartItems: [],
    totalAmount: 0,
    paymentId: undefined,
    shippingId: undefined,
    invoiceId: undefined,
    payment: undefined,
    shipping: undefined,
    invoice: undefined,
    statusHistory: [],
    placedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCancelled: false,
  },
  setOrder: (update) =>
    set((state) => ({
      order: {
        ...state.order,
        ...update,
      },
    })),
  resetOrder: () =>
    set(() => ({
      order: {
        _id: "",
        orderNumber: "",
        userId: "",
        cartItems: [],
        totalAmount: 0,
        paymentId: undefined,
        shippingId: undefined,
        invoiceId: undefined,
        payment: undefined,
        shipping: undefined,
        invoice: undefined,
        statusHistory: [],
        placedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCancelled: false,
      },
    })),
}));

export default useOrderStore;
