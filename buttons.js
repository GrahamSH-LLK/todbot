
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default new ActionRowBuilder()
			.addComponents(
                new ButtonBuilder()
                .setCustomId('truth')
                .setLabel('Truth')
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId('dare')
                .setLabel('Dare')
                .setStyle(ButtonStyle.Danger),

				new ButtonBuilder()
					.setCustomId('random')
					.setLabel('Random')
					.setStyle(ButtonStyle.Primary),

			);