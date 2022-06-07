import { ShoppingRepo } from "../database/index.js";
import { formatData } from "../utils/index.js";
import { APIError } from "../utils/app-errors.js";

export class ShoppingService {
  static async placeOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await ShoppingRepo.createNewOrder(_id, txnNumber);
      return formatData(orderResult);
    } catch (err) {
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
}
