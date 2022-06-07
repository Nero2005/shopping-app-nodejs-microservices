import { ShoppingRepo } from "../database/index.js";
import { formatData } from "../utils/index.js";
import { APIError } from "../utils/app-errors.js";

export class ShoppingService {
  static async getCart({ _id }) {
    try {
      const cartItems = await ShoppingRepo.cart(_id);

      return formatData(cartItems);
    } catch (err) {
      throw err;
    }
  }
  static async placeOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await ShoppingRepo.createNewOrder(_id, txnNumber);
      return formatData(orderResult);
    } catch (err) {
      console.log(err);
      throw new APIError("Data Not found", err);
    }
  }

  static async getOrders(customerId) {
    try {
      const orders = await ShoppingRepo.orders(customerId);
      return formatData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async manageCart(customerId, item, qty, isRemove) {
    try {
      console.log(item, "Shopping Service Cart");

      const cartResult = await ShoppingRepo.addCartItem(
        customerId,
        item,
        qty,
        isRemove
      );

      return formatData(cartResult);
    } catch (err) {
      throw err;
    }
  }

  static async subscribeEvents(payload) {
    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.manageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.manageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }

  static async getOrderPayload(userId, order, event) {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };

      return payload;
    } else {
      return formatData({ error: "No Order Available" });
    }
  }
}
