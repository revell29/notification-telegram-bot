import Bluebird from "bluebird";
import dotenv from "dotenv";
import qs from "qs";
dotenv.config();

const fetch = require("node-fetch");

const TELEGRAM_URL = "https://api.telegram.org/bot";
const TELEGRAM_KEY = process.env.TELEGRAM_TOKEN;

fetch.Promise = Bluebird;

const headers = {
  "Content-Type": "application/json",
};

export const sendMessage = async (data: any) => {
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
        console.log(json);
        return resolve(json);
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
};
