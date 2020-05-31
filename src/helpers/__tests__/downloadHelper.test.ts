import { downloadComicImage } from '~src/helpers/downloadHelper';
import fs from 'fs';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

describe('Download Helper', () => {
	const url = 'testUrl';
	const directory = 'testDirectory';
	const page = 0;

	beforeAll(() => {
		jest.spyOn(fs, 'createWriteStream').mockImplementation(jest.fn());
		jest.spyOn(fs, 'mkdirSync').mockImplementation(jest.fn());
		jest.spyOn(axios, 'get').mockImplementation(
			(
				url: string,
				config?: AxiosRequestConfig | undefined
			): Promise<AxiosResponse> => {
				let returnVal: AxiosResponse = {
					data: '',
					status: 200,
					statusText: 'Found',
					headers: {},
					config: {}
				};
				returnVal.data = {
					pipe: (writeStream: any) => {
						returnVal.data.on = (value: string, callback: () => void) => {
							callback();
						};
					}
				};

				return new Promise((resolve) => {
					resolve(returnVal);
				});
			}
		);
	});

	it('should download comic from url', () => {
		downloadComicImage(url, directory, page);

		expect(axios.get).toBeCalled();
	});

	it('should create directory given directory', () => {
		downloadComicImage(url, directory, page);

		expect(fs.mkdirSync).toBeCalledWith(directory, { recursive: true });
	});

	it('should createWriteStream from url', () => {
		downloadComicImage(url, directory, page);

		expect(fs.createWriteStream).toBeCalled();
	});
});
