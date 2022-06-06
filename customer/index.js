import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Customer Microservice" });
});

app.listen(8001, async () => {
  console.log(`Customer is listening on port 8001`);
});