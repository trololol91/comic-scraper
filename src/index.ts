#!/usr/bin/env ts-node-script
import { ReadComicsOnlineService } from './services/ReadComicsOnlineService';
import { IDownloaderService } from './services/base/IDownloaderService';
import { DOWNLOAD_TYPE } from '~src/resources/enums';

const getDownloadServiceOnSource = (source: string): IDownloaderService => {
	switch (source.toLowerCase()) {
		case 'getcomics':
		case 'readcomicsonline':
			return new ReadComicsOnlineService();
		default:
			throw new Error(`Source ${source} is not supported`);
	}
};

const downloadImages = (
	source: string,
	comicDlId: string,
	dlType: DOWNLOAD_TYPE
) => {
	console.log(`Downloading ${comicDlId} in URL in ${source}`);
	const dlService = getDownloadServiceOnSource(source);

	if (dlType === DOWNLOAD_TYPE.COMIC) {
		dlService.getComic(comicDlId);
	} else {
		dlService.getSeries(comicDlId);
	}
};

downloadImages('getcomics', 'green lantern', DOWNLOAD_TYPE.COMIC);
