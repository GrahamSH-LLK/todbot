import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import config from "./config.js";
import fs from 'fs'
const { token } = config;
import { importScripts, extractMessageExtremities } from "./util.js";
import dare from "./commands/dare.js";
import truth from "./commands/truth.js";
import random from "./commands/random.js";
import path from "node:path";
import * as url from "node:url";
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMessages],
  partials: [Partials.Message],
});
console.log()

client.once(Events.ClientReady, (c) => {
  client.on("messageDelete", async (messageDelete) => {
    console.log(messageDelete)
    let {files} = await extractMessageExtremities(messageDelete)
    let content = `${messageDelete.author.username}: ${messageDelete.content} (${files.reduce((acc, val)=> {
      return acc + val.url
    }, '')})\n`;
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

client.login(token);
