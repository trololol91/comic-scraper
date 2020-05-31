/* istanbul ignore file */
import axios from 'axios';
import { createWriteStream, mkdirSync } from 'fs';

export const downloadComicImage = async (
	url: string,
	directory: string,
	page: number
) => {
	// console.log(`Downloading ${url} to ${directory}`);
	const response = await axios.get(url, {
		responseType: 'stream'
	});

	// create directory if not available
	mkdirSync(`${directory}`, { recursive: true });

	// get file extenstion
	const urlPath = url.split('/');
	const filename = urlPath[urlPath.length - 1].split('.');
	const fileExtension = filename[filename.length - 1].trim();

	// get filename
	response.data.pipe(
		createWriteStream(`${directory}/${page}.${fileExtension}`)
	);

	// return a promise and resolve when download finishes
	return new Promise((resolve, reject) => {
		response.data.on('end', () => {
			resolve();
		});

		response.data.on('error', () => {
			/* istanbul ignore next */
			reject();
		});
	});
};
