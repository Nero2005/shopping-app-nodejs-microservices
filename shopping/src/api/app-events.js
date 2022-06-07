import { ShoppingService } from "../services/shopping-service.js";

export const shoppingAppEvents = (app) => {
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    ShoppingService.subscribeEvents(payload);

    console.log("========== Shopping Service Received Event ===== ");
    return res.status(200).json(payload);
  });
};
