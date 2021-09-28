import dotenv from "dotenv";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { dateTimezone } from "./dateFormat";
import fs from "fs";
import { pathToFileURL, writeTempFile } from "./file";

dotenv.config();
const client = new Client();

client.on("ready", () => {
  console.log(client.user.tag);
  client.user.setPresence({ activity: { name: "Subscribe" } });
});


export const sendMessageDiscord = async (body: any) => {
  const channel = client.channels.cache.find(
    (ch: any) => ch.name === `${process.env.CHANNEL_NAME}`
  );

  if (channel) {
    if (
      !((channel): channel is TextChannel => channel.type === "text")(channel)
    )
      return;

    const reportEmbeded = new MessageEmbed()
      .setColor("#7DB942")
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setTitle(`Report Error ${body.location_name}`)
      .setURL(body.url)
      .setDescription(body.message)
      .addFields(
        { name: "Lokasi", value: body.location_name },
        { name: "Register", value: body.registerName },
        { name: "Email", value: body.email },
        { name: "Waktu", value: dateTimezone("Asia/Jakarta") }
      );

    const filePath = await writeTempFile(`request`, JSON.stringify(JSON.parse(body.payload), null, 2));
    await channel.send(reportEmbeded);
    await channel
      .send(`Payload for ${body.location_name}`, {
        files: [filePath],
      })
      .then((res) => {
        console.log('success send to channel')
        console.log(res.content)
        fs.unlinkSync(filePath);
      });
  }
};

export {client}
