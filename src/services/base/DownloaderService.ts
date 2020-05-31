import axios, { AxiosInstance } from 'axios';
import { IDownloaderService } from './IDownloaderService';

export abstract class DownloaderService implements IDownloaderService {
	public axiosInstance: AxiosInstance;
	public imageDirectory: string;

	constructor(url: string, imageDirectory: string) {
		this.axiosInstance = axios.create({
			baseURL: url
		});
		this.imageDirectory = imageDirectory;
	}

	public abstract getIssue(comic: string, issue: number): void;
	public abstract getSeries(comic: string): void;
}
