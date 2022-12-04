import { SlashCommandBuilder } from "discord.js";
import { both } from "../data.js";
import Embed from "../embed.js";
import Buttons from '../buttons.js'
export default {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Random TOD Question"),
  async execute(interaction) {
    await interaction.reply({
      embeds: [Embed("Random", both[Math.floor(Math.random() * both.length)])],
      components: [Buttons]
    });
  },
};
