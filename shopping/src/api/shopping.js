import { ShoppingService } from "../services/shopping-service.js";
import { CustomerService } from "../services/customer-service.js";
import { authToken } from "./middlewares/auth.js";

export const shoppingCtrl = (app) => {
  app.post("/shopping/order", authToken, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
      const { data } = await ShoppingService.placeOrder({ _id, txnNumber });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/shopping/orders", authToken, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await CustomerService.getShoppingDetails(_id);
      return res.status(200).json(data.orders);
    } catch (err) {
      next(err);
    }
  });

  app.get("/shopping/cart", authToken, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const { data } = await CustomerService.getShoppingDetails(_id);
      return res.status(200).json(data.cart);
    } catch (err) {
      next(err);
    }
  });
};
