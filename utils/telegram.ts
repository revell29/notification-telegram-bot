import dotenv from "dotenv";
import qs from "qs";
import FormData from "form-data";
dotenv.config();
import fs from "fs";

const TELEGRAM_KEY = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = "https://api.telegram.org/bot";
import axios from "axios";
export interface SendMessage {
  chat_id: string;
  filePath: string;
  text: string;
}

export const sendTelegramMessage = async (data: SendMessage) => {
  return new Promise(async (resolve, reject) => {
    const query = qs.stringify({
      chat_id: data.chat_id,
      caption: data.text,
      parse_mode: "HTML",
    });

    const form = new FormData();
    form.append("document", fs.createReadStream(data.filePath));

    axios
      .post(`${TELEGRAM_URL}${TELEGRAM_KEY}/sendDocument?${query}`, form)
      .then((res: any) => {
        console.log("success send telegram");
        return resolve(res);
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
};
