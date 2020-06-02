import axios from 'axios';
import { createWriteStream, mkdirSync, existsSync } from 'fs';

export const downloadComicImage = async (
	url: string,
	directory: string,
	page: number
) => {
	// create directory if not available
	if (!existsSync(directory)) {
		mkdirSync(directory, { recursive: true });
	}

	const response = await axios.get(url, {
		responseType: 'stream'
	});

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
			reject();
		});
	});
};
