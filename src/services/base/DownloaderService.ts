import axios, { AxiosInstance } from 'axios';
import { IDownloaderService } from './IDownloaderService';

export abstract class DownloaderService implements IDownloaderService {
	private axiosInstance: AxiosInstance;

	constructor(url: string) {
		this.axiosInstance = axios.create({
			baseURL: url
		});
	}

	abstract getComic(comic: string): void;
	abstract getSeries(series: string): void;
}
