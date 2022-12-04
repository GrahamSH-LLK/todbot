import { SlashCommandBuilder } from "discord.js";
import { dares } from "../data.js";
import Embed from "../embed.js";
import Buttons from '../buttons.js'
export default {
  data: new SlashCommandBuilder()
    .setName("dare")
    .setDescription("Dare TOD Question"),
  async execute(interaction) {
    await interaction.reply({
      embeds: [Embed("Dare", dares[Math.floor(Math.random() * dares.length)])],
      components: [Buttons]
    });
  },
};
