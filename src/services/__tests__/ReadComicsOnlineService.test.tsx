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
				if (url.charAt(url.length - 1).match(/[0-9]+/)) {
					returnVal.data = fs.readFileSync(
						'src/services/__tests__/test_resource/readcominconline_getIssue',
						{
							encoding: 'utf-8'
						}
					);
				} else {
					returnVal.data = '';
				}

				return new Promise((resolve) => {
					resolve(returnVal);
				});
			}
		);
	});

	it('should download comics in given comic', async () => {
		await readComicsOnlineService.getIssue(
			'hal-jordan-and-the-green-lantern-corps-2016',
			1
		);
		expect(readComicsOnlineService.axiosInstance.get).toBeCalledTimes(24);
		expect(downloadHelper.downloadComicImage).toBeCalledTimes(23);
	}, 300000);
});
