import Express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { sendTelegramMessage } from "../utils/telegram";
import { dateTimezone } from "../utils/dateFormat";
import cors from "cors";
import "moment/locale/id";
import dotenv from "dotenv";
import { writeTempFile } from "../utils/file";

const app = Express();
const PORT = 8001;
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

interface ITemplateTelegram {
  location_name: string;
  registerName: string;
  email: string;
  message: string;
  url: string;
  payload: any;
  status: number;
  action: string;
}

const templateTelegram = ({
  location_name,
  registerName,
  email,
  message,
  url,
  payload,
  status,
  action,
}: ITemplateTelegram) => {
  const text = `<b>Log POS</b>
<b>Lokasi:</b> ${location_name}
<b>Register:</b> ${registerName}
<b>Email:</b> ${email}
<b>Waktu</b> ${dateTimezone("Asia/Jakarta")}
<b>Version</b> ${action ? "POSV3" : "POSV2"}
<b>URL:</b> ${url}
<b>Status:</b> ${status}
<b>Message:</b>
<pre><code>${message}</code></pre>
`;
  return text;
};

app.post("/api/notification", async (req: Request, res: Response) => {
  try {
    let {
      message,
      email,
      registerName,
      location_name,
      url,
      payload,
      status,
      action,
    } = req.body;

    if (payload !== "") {
      payload = JSON.stringify(JSON.parse(payload), null, 2);
    }

    const filePath = await writeTempFile(action, payload);
    console.log(filePath);

    await sendTelegramMessage({
      chat_id: process.env.GROUP_CHAT_ID,
      filePath,
      text: templateTelegram({
        location_name,
        registerName,
        email,
        message,
        url,
        payload,
        status,
        action,
      }),
    });

    // await sendMessageDiscord(req.body);
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
