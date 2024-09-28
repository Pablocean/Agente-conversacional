import express from "express";
import cors from "cors";
import { createChain } from "./bot.js";

const app = express();
const port = 5000;

// app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);
app.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
});

app.post("/api/chat", async (req, res) => {
  const { firstname, textInput } = req.body;
  console.log(textInput);

  const ragChain = await createChain(textInput);

  res.json(ragChain);
});
