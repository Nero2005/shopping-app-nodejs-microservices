import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Shopping Microservice" });
});

app.listen(8003, async () => {
  console.log(`Shopping is listening on port 8003`);
});
