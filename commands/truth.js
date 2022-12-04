import { SlashCommandBuilder } from "discord.js";
import { truths } from "../data.js";
import Embed from "../embed.js";
import Buttons from '../buttons.js'
export default {
  data: new SlashCommandBuilder()
    .setName("truth")
    .setDescription("Truth TOD Question"),
  async execute(interaction) {
    await interaction.reply({
      embeds: [Embed("Truth", truths[Math.floor(Math.random() * truths.length)])],
      components: [Buttons]
    });
  },
};
