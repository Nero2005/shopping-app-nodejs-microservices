import { ProductService } from "../services/product-service.js";

export const productsAppEvents = (app) => {
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    // ProductService.subscribeEvents(payload);

    console.log("========== Products Service Received Event ===== ");
    return res.status(200).json(payload);
  });
};
