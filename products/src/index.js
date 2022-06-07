import "dotenv/config";
import express from "express";
import cors from "cors";
import { dbConnection } from "./database/index.js";
import { products, appEvents } from "./api/index.js";

const app = express();

app.use(express.json());
app.use(cors());

appEvents(app);

// customer(app);
products(app);
// shopping(app);

const PORT = process.env.PORT || 5000;

app
  .listen(PORT, async () => {
    await dbConnection();
    console.log(`Server listening on port ${PORT}`);
  })
  .on("error", (err) => {
    console.log(err);
    process.exit();
  });

export default app;
