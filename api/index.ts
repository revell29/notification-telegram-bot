import Express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { sendMessage } from "../utils/telegram";
import cors from "cors";
import moment from "moment";
import "moment/locale/id";

const app = Express();
const PORT = 8001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/api/notification", async (req: Request, res: Response) => {
  try {
    let { message, email, registerName, location_name, url, payload, status } =
      req.body;

    if (payload !== "") {
      payload = JSON.stringify(JSON.parse(payload), null, 2);
    }

    const text = `<b>POS Report Error</b>
==========================================
<b>Lokasi:</b> ${location_name}
<b>Register:</b> ${registerName}
<b>Email:</b> ${email}
<b>Waktu</b> ${moment().locale("id").format("DD MMMM YYYY HH:mm")}
==========================================

<b>Message:</b>
<pre><code>${message}</code></pre>

<b>URL:</b> ${url}
<b>Status:</b> ${status}
<b>Payload:</b>
<pre><code>${payload}</code></pre>
`;

    await sendMessage({
      chat_id: -512955149,
      text: text,
    });

    console.log(text);
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

app.get("/", (req, res) => {
  res.send({
    message: "What are you looking bro?",
  });
});

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}, http://localhost:${PORT}`)
);
