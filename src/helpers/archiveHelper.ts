import { createWriteStream, mkdirSync, existsSync } from 'fs';
import archiver from 'archiver';
import rimraf from 'rimraf';

/**
 * Create cbz from a srcDirectory that contains comic images
 * @param srcDirectory source directory to add to cbz
 * @param destDirectory destication of the cbz file
 * @param filename filename to call the cbz
 */
export const createCPZ = async (
	srcDirectory: string,
	destDirectory: string,
	filename: string
) => {
	if (!existsSync(destDirectory)) {
		mkdirSync(destDirectory, { recursive: true });
	}

	const archive = archiver('zip');

	archive.on('warning', function (err) {
		if (err.code === 'ENOENT') {
			console.warn(`Error: ${err.code} with message ${err.message}`);
		} else {
			throw err;
		}
	});

	archive.on('error', function (err) {
		throw err;
	});

	archive.pipe(createWriteStream(destDirectory + `/${filename}.cbz`));

	archive.directory(srcDirectory, false);

	await archive.finalize();

	rimraf(srcDirectory, (error: Error) => {
		if (error) {
			throw error;
		}
	});
};
