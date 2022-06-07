import { CustomerService } from "../services/customer-service.js";

export const customerAppEvents = (app) => {
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    CustomerService.subscribeEvents(payload);

    console.log("========== Customer Service Received Event ===== ");
    return res.status(200).json(payload);
  });
};
