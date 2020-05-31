#!/usr/bin/env ts-node-script
/* istanbul ignore file */

import { ReadComicsOnlineService } from './services/ReadComicsOnlineService';
import { IDownloaderService } from './services/base/IDownloaderService';

const getDownloadServiceOnSource = (source: string): IDownloaderService => {
	switch (source.toLowerCase()) {
		case 'getcomics':
		case 'readcomicsonline':
			return new ReadComicsOnlineService('output');
		default:
			throw new Error(`Source ${source} is not supported`);
	}
};

const downloadImages = (
	source: string,
	comicDlId: string,
	issueNumber?: number
) => {
	console.log(`Downloading ${comicDlId} in URL in ${source}`);
	const dlService = getDownloadServiceOnSource(source);

	if (issueNumber) {
		dlService.getIssue(comicDlId, issueNumber);
	} else {
		dlService.getSeries(comicDlId);
	}
};

downloadImages('getcomics', 'hal-jordan-and-the-green-lantern-corps-2016', 1);
