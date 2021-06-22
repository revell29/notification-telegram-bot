import Express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { sendMessage } from "../utils/telegram";
import cors from "cors";
import moment from "moment";
import "moment/locale/id";

const app = Express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/api/notification", async (req: Request, res: Response) => {
  try {
    const { message, email, registerName, location_name, payload } = req.body;
    const text = `<b>POS Report Error</b>
==========================================
<b>Lokasi:</b> ${location_name}
<b>Register:</b> ${registerName}
<b>Email:</b> ${email}
<b>Waktu</b> ${moment().locale("id").format("DD MMMM YYYY HH:mm")}
==========================================

<b>Message:</b>
<pre><code>${message}</code></pre>

<b>Payload:</b>
<pre><code>${JSON.stringify(JSON.parse(payload), null, 2)}</code></pre>
`;

    await sendMessage({
      chat_id: -512955149,
      text: text,
    });

    console.log(req.body);
    res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post("/api/webhook", (req, res) => {
  try {
    console.log(req.body);
    return res.status(200).send({ message: req.body });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

app.use("/*", (req, res) => {
  res.send({
    message: "What are you looking bro?",
  });
});

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}, http://localhost:${PORT}`)
);

module.exports = app;
