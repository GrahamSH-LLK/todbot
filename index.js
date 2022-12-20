import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import config from "./config.js";
import fs from "fs";
const { token } = config;
import { importScripts, extractMessageExtremities } from "./util.js";
import dare from "./commands/dare.js";
import truth from "./commands/truth.js";
import random from "./commands/random.js";
import path from "node:path";
import * as url from "node:url";
import http from "http";
import fetch from "node-fetch";
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Message],
});
console.log();
const getDataURI = async (url) => {
  const response = await fetch(url);
  const blob = await response.arrayBuffer();
  return `data:${response.headers.get("content-type")};base64,${Buffer.from(
    blob
  ).toString("base64")}`;
};
client.once(Events.ClientReady, (c) => {
  client.on("messageDelete", async (messageDelete) => {
    console.log(messageDelete);
    let { files } = await extractMessageExtremities(messageDelete);
    console.log(await getDataURI(files[0].url))
    let content = `${messageDelete.author.username}: ${
      messageDelete.content
    } (${await files.reduce(async (acc, val) => {
      return acc + `<img src="${await getDataURI(val.url)}"> `;
    }, "")})\n`;
    fs.appendFile("db.txt", content, (err) => {
      return console.log(err);
    });
  });

  console.log(`Ready! Logged in as ${c.user.tag}`);
});
const commands = importScripts(path.resolve(dirname, "./commands"));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  //console.log(interaction.client.application.commands)

  const command = (await commands).get(interaction.commandName || "");
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, {});
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
  }
});
client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId == "random") random.execute(interaction);
  else if (interaction.customId == "truth") truth.execute(interaction);
  else if (interaction.customId == "dare") dare.execute(interaction);
});
const start = `<!DOCTYPE html><html><link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
<head></head><body><ul>`;
const end = `</body></html>`;

const requestListener = function (req, res) {
  res.writeHead(200);
  fs.readFile("db.txt", function (err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    let reduced = array.reduce((previousValue, currentValue) => {
      return `${previousValue} <li> ${currentValue}</li>`;
    }, "");
    res.end(`${start}${reduced}${end}`);
  });
};
const server = http.createServer(requestListener);
server.listen(8090, "localhost", () => {
  console.log(`Server is running on http://localhost:8090`);
});

client.login(token);
