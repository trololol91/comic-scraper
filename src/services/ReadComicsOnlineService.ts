import { DownloaderService } from './base/DownloaderService';
import { ReadComicsOnline } from '~src/resources/sourceUrls';

export class ReadComicsOnlineService extends DownloaderService {
	constructor() {
		super(ReadComicsOnline);
	}

	getComic(comic: any): void {
		console.log(`Getting comic ${comic}`);
	}

	getSeries(series: any): void {
		console.log(`Getting series ${series}`);
	}
}
