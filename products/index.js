import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Products Microservice" });
});

app.listen(8002, async () => {
  console.log(`Products is listening on port 8002`);
});
