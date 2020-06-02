import { createCPZ } from '~src/helpers/archiveHelper';
import fs from 'fs';
import * as archiver from 'archiver';
import { Archiver, ArchiverError, ArchiverOptions, Format } from 'archiver';
import * as rimraf from 'rimraf';

const archiverReturn = (code: string, error: string) => {
	return {
		on: (key: string, callback: (arg0: ArchiverError | undefined) => void) => {
			if (key === error && (error === 'warning' || error === 'error')) {
				callback({
					data: 'data',
					name: 'name',
					code,
					message: 'message'
				});
			}
		},
		pipe: () => {},
		directory: () => {},
		finalize: () => {
			return new Promise((resolve) => {
				resolve();
			});
		}
	};
};

jest.mock('archiver', () =>
	jest.fn(() => {
		return archiverReturn('ENOENT', 'No warning');
	})
);

jest.mock('rimraf', () => jest.fn((path, callback) => {}));

describe('Download Helper', () => {
	const srcDirectory = 'testSrcDirectory';
	const destDirecrory = 'testDestDirectory';
	const filename = 'testFilename';

	beforeEach(() => {
		jest.spyOn(fs, 'createWriteStream').mockImplementation(jest.fn());
		jest.spyOn(fs, 'mkdirSync').mockImplementation(jest.fn());
		jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
			return false;
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should start write stream', async () => {
		await createCPZ(srcDirectory, destDirecrory, filename);

		expect(fs.createWriteStream).toBeCalled();
	});

	it('should not call mkdir', async () => {
		jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
			return true;
		});

		await createCPZ(srcDirectory, destDirecrory, filename);

		expect(fs.mkdirSync).not.toBeCalled();
	});

	it('should remove srcDirectory', async () => {
		await createCPZ(srcDirectory, destDirecrory, filename);

		expect(rimraf).toBeCalledWith(srcDirectory, expect.anything());
	});

	it('should call console warning on ENOENT', async () => {
		jest.spyOn(console, 'warn');
		jest.spyOn(archiver, 'default').mockImplementationOnce(
			(format: Format, options: ArchiverOptions | undefined): Archiver => {
				return (archiverReturn('ENOENT', 'warning') as unknown) as Archiver;
			}
		);

		await createCPZ(srcDirectory, destDirecrory, filename);

		expect(console.warn).toBeCalled();
	});

	it('should call throw error on warning', () => {
		jest.spyOn(console, 'warn');
		jest.spyOn(archiver, 'default').mockImplementation(
			(format: Format, options: ArchiverOptions | undefined): Archiver => {
				return (archiverReturn('Error', 'warning') as unknown) as Archiver;
			}
		);

		expect(createCPZ(srcDirectory, destDirecrory, filename)).rejects.toEqual({
			code: 'Error',
			data: 'data',
			message: 'message',
			name: 'name'
		});
	});

	it('should call throw error on error', () => {
		jest.spyOn(console, 'warn');
		jest.spyOn(archiver, 'default').mockImplementation(
			(format: Format, options: ArchiverOptions | undefined): Archiver => {
				return (archiverReturn('Error', 'error') as unknown) as Archiver;
			}
		);

		expect(createCPZ(srcDirectory, destDirecrory, filename)).rejects.toEqual({
			code: 'Error',
			data: 'data',
			message: 'message',
			name: 'name'
		});
	});
});
