import { ProductService } from "../services/product-service.js";
import {
  publishCustomerEvents,
  publishShoppingEvents,
} from "../utils/index.js";
import { authToken } from "./middlewares/auth.js";

export const productsCtrl = (app) => {
  app.post("/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, supplier, banner } =
        req.body;
      // validation
      const { data } = await ProductService.createProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await ProductService.getProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await ProductService.getSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await ProductService.getProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/wishlist", authToken, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await ProductService.getProductPayload(
      _id,
      { productId: req.body._id },
      "ADD_TO_WISHLIST"
    );
    try {
      publishCustomerEvents(data);
      return res.status(200).json(data);
    } catch (err) {}
  });

  app.delete("/wishlist/:id", authToken, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    const { data } = await ProductService.getProductPayload(
      _id,
      { productId: productId },
      "REMOVE_FROM_WISHLIST"
    );

    try {
      publishCustomerEvents(data);
      // const product = await ProductService.getProductById(productId);
      // const wishlist = await CustomerService.addToWishlist(_id, product);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/cart", authToken, async (req, res, next) => {
    const { _id, qty } = req.body;

    try {
      const product = await ProductService.getProductById(_id);

      const result = await CustomerService.manageCart(
        req.user._id,
        product,
        qty,
        false
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cart/:id", authToken, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const product = await ProductService.getProductById(req.params.id);
      const result = await CustomerService.manageCart(_id, product, 0, true);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await ProductService.getProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
