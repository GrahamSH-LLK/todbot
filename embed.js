import {EmbedBuilder} from 'discord.js'
export default function Embed(title, question) {
    return new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(title)
	.setDescription(question)

}