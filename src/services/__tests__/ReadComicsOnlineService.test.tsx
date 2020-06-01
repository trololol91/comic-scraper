import { ReadComicsOnlineService } from '~src/services/ReadComicsOnlineService';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as downloadHelper from '~src/helpers/downloadHelper';
import fs from 'fs';

describe('ReadComicsOnlineService', () => {
	let readComicsOnlineService: ReadComicsOnlineService;

	beforeAll(() => {
		readComicsOnlineService = new ReadComicsOnlineService('output');
		jest
			.spyOn(downloadHelper, 'downloadComicImage')
			.mockImplementation((url: string, directory: string, page: number) => {
				return new Promise((resolve) => {
					resolve();
				});
			});
		jest.spyOn(readComicsOnlineService.axiosInstance, 'get').mockImplementation(
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
				const urlPath = url.split('/');
				if (urlPath[urlPath.length - 1].match(/^[0-9]+/)) {
					returnVal.data = fs.readFileSync(
						'src/services/__tests__/test_resource/readcominconline_getIssue',
						{
							encoding: 'utf-8'
						}
					);
				} else {
					returnVal.data = fs.readFileSync(
						'src/services/__tests__/test_resource/readcomicsonline_getSeries',
						{
							encoding: 'utf-8'
						}
					);
				}

				return new Promise((resolve) => {
					resolve(returnVal);
				});
			}
		);
	});

	it('should download comic issue in given name and issue', async () => {
		await readComicsOnlineService.getIssue(
			'hal-jordan-and-the-green-lantern-corps-2016',
			1
		);
		expect(readComicsOnlineService.axiosInstance.get).toBeCalledTimes(24);
		expect(downloadHelper.downloadComicImage).toBeCalledTimes(23);
	});

	it('should download series given series name', async () => {
		await readComicsOnlineService.getSeries(
			'hal-jordan-and-the-green-lantern-corps-2016'
		);
		expect(readComicsOnlineService.axiosInstance.get).toBeCalledTimes(1225);
		expect(downloadHelper.downloadComicImage).toBeCalledTimes(23 * 51);
	});
});
