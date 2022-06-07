import { CustomerService } from "../services/customer-service.js";
import { authToken } from "./middlewares/auth.js";

export const customerCtrl = (app) => {
  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await CustomerService.signUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
  app.post("/signin", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await CustomerService.signIn({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/address", authToken, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await CustomerService.addNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/profile", authToken, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await CustomerService.getProfile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/shopping-details", authToken, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await CustomerService.getShoppingDetails(_id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/wishlist", authToken, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await CustomerService.getWishList(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
