import { ShoppingService } from "../services/shopping-service.js";
import {
  publishCustomerEvents,
  publishShoppingEvents,
} from "../utils/index.js";
import { authToken } from "./middlewares/auth.js";

export const shoppingCtrl = (app) => {
  app.post("/order", authToken, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
      const { data } = await ShoppingService.placeOrder({ _id, txnNumber });
      const payload = await ShoppingService.getOrderPayload(_id, data, "CREATE_ORDER");
      publishCustomerEvents(payload);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/orders", authToken, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await ShoppingService.getOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cart", authToken, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const { data } = await ShoppingService.getCart(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
