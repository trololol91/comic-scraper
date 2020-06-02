import { DownloaderService } from './base/DownloaderService';
import { ReadComicsOnline } from '~src/resources/sourceUrls';
import { downloadComicImage } from '~src/helpers/downloadHelper';
import { createCPZ } from '~src/helpers/archiveHelper';
import cheerio from 'cheerio';

export class ReadComicsOnlineService extends DownloaderService {
	private COMIC_ISSUE_URL_FORMAT = '/comic/%COMIC_ID%/%ISSUE_NUMBER%';
	private COMIC_ISSUE_PAGE_URL_FORMAT =
		'/comic/%COMIC_ID%/%ISSUE_NUMBER%/%ISSUE_PAGE%';
	private COMIC_URL_FORMAT = '/comic/%COMIC_ID%';

	constructor(imageDirectory: string) {
		super(ReadComicsOnline, imageDirectory);
	}

	private getPages(cheerioData: CheerioStatic): number {
		return cheerioData('select#page-list')[0].children.filter((elem) => {
			return elem.name === 'option';
		}).length;
	}

	private getNumOfIssues(cheerioData: CheerioStatic): number {
		return cheerioData('ul.chapters').children().length;
	}

	private async downloadIssue(
		comic: string,
		issue: number,
		pages: number
	): Promise<void> {
		const comicDirectory = `${this.imageDirectory}/${comic}`;
		const outputDirectory = `${comicDirectory}/${issue}`;

		for (let page = 1; page <= pages; page++) {
			console.log(
				`Downloading ${comic} issue ${issue} page ${page} of ${pages}`
			);
			// Get Comic
			const response = await this.axiosInstance.get(
				this.COMIC_ISSUE_PAGE_URL_FORMAT.replace('%COMIC_ID%', comic)
					.replace('%ISSUE_NUMBER%', issue.toString())
					.replace('%ISSUE_PAGE%', page.toString())
			);

			// Get Image URL
			const cheerioData = cheerio.load(response.data);
			const imageUrl = cheerioData('#ppp > a > img.img-responsive')[0].attribs
				.src;
			const filename = `${comic}-${issue}`;

			await downloadComicImage(imageUrl, outputDirectory, page);
			await createCPZ(outputDirectory, comicDirectory, filename);
		}
	}

	private async downloadSeries(
		comic: string,
		numOfIssues: number
	): Promise<void> {
		for (let issue = 1; issue <= numOfIssues; issue++) {
			await this.getIssue(comic, issue);
		}
	}

	/**
	 * Download a specific issue of a comic series
	 * @param comic comic to download
	 * @param issue download specific issue
	 */
	public async getIssue(comic: string, issue: number): Promise<void> {
		// Get Comic
		const response = await this.axiosInstance.get(
			this.COMIC_ISSUE_URL_FORMAT.replace('%COMIC_ID%', comic).replace(
				'%ISSUE_NUMBER%',
				issue.toString()
			)
		);

		const cheerioData = cheerio.load(response.data);

		// Get Pages
		const pages = this.getPages(cheerioData);

		// Download Images
		await this.downloadIssue(comic, issue, pages);
	}

	/**
	 * Get whole series
	 * @param comic comic to download
	 */
	public async getSeries(comic: string): Promise<void> {
		// Get Comic
		const response = await this.axiosInstance.get(
			this.COMIC_URL_FORMAT.replace('%COMIC_ID%', comic)
		);

		const cheerioData = cheerio.load(response.data);

		// Get Number of Issues
		const numOfIssues = this.getNumOfIssues(cheerioData);

		// Download Series
		await this.downloadSeries(comic, numOfIssues);
	}
}
