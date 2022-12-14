import fileSystem from "fs/promises";
import path from "path";
import url from "url";

import { Collection } from "discord.js";

export async function getFileNames(directory) {
	return (
		await Promise.all(
			(
				await fileSystem.readdir(directory)
			).map(async (file) => {
				const fullPath = path.join(directory, file);
				return (await fileSystem.lstat(fullPath)).isDirectory()
					? await getFileNames(fullPath)
					: fullPath;
			}),
		)
	).flat();
}

export async function importScripts(
	directory) {
	const collection = new Collection();

	const siblings = (await getFileNames(directory)).filter((file) => path.extname(file) === ".js");

	const promises = siblings.map(async (sibling) => {
		const filename = (
			path.relative(directory, sibling).split(path.extname(sibling))[0] ||
			path.relative(directory, sibling)
		)
			.split(path.sep)
			.reduce((accumulated, item) =>
				accumulated
					? accumulated + (item[0] || "").toUpperCase() + item.slice(1)
					: item.toLowerCase(),
			);

		const resolved = url.pathToFileURL(path.resolve(directory, sibling)).toString();

		collection.set(filename, (await import(resolved)).default);
	});

	await Promise.all(promises);

	return collection;
}

export async function extractMessageExtremities(
	message,
	allowLanguage = true,
){
	const embeds = [
		...message.stickers
			.filter((sticker) => {
				return allowLanguage || !censor(sticker.name);
			})
			.map((sticker) => ({ image: { url: sticker.url }, color: Colors.Blurple })),
		...message.embeds
			.filter((embed) => !embed.video)
			.map(({ data }) => {
				if (allowLanguage) return data;

				const newEmbed = { ...data };

				if (newEmbed.description) {
					const censored = censor(newEmbed.description);

					if (censored) newEmbed.description = censored.censored;
				}

				if (newEmbed.title) {
					const censored = censor(newEmbed.title);

					if (censored) newEmbed.title = censored.censored;
				}

				if (newEmbed.url && censor(newEmbed.url)) newEmbed.url = "";

				if (newEmbed.image?.url && censor(newEmbed.image.url)) newEmbed.image = undefined;

				if (newEmbed.thumbnail?.url && censor(newEmbed.thumbnail.url))
					newEmbed.thumbnail = undefined;

				if (newEmbed.footer?.text) {
					const censored = censor(newEmbed.footer.text);

					if (censored) {
						newEmbed.footer.text = censored.censored;
					}
				}

				if (newEmbed.author) {
					const censoredName = censor(newEmbed.author.name);
					const censoredUrl = newEmbed.author.url && censor(newEmbed.author.url);

					if (censoredName) {
						newEmbed.author.name = censoredName.censored;
					}
					if (censoredUrl) {
						newEmbed.author.url = "";
					}
				}

				newEmbed.fields = (newEmbed.fields || []).map((field) => {
					const censoredName = censor(field.name);
					const censoredValue = censor(field.value);
					return {
						name: censoredName ? censoredName.censored : field.name,
						value: censoredValue ? censoredValue.censored : field.value,
						inline: field.inline,
					};
				});

				return newEmbed;
			}),
	];

	while (embeds.length > 10) embeds.pop();

	return { embeds, files: message.attachments.toJSON() };
}
