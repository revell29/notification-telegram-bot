import dotenv from "dotenv";
import qs from "qs";
dotenv.config();

const TELEGRAM_KEY = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = "https://api.telegram.org/bot";
import fetch from "node-fetch";

export interface SendMessage {
  chat_id: string;
  text: string;
}

export const sendMessage = async (data: SendMessage) => {
  return new Promise(async (resolve, reject) => {
    const query = qs.stringify({
      chat_id: data.chat_id,
      text: data.text,
      parse_mode: "HTML",
    });

    fetch(`${TELEGRAM_URL}${TELEGRAM_KEY}/sendMessage?${query}`, {
      method: "POST",
    })
      .then((res: any) => res.json())
      .then((json: any) => {
        return resolve(json);
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
};
