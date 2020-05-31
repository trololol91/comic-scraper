import { DownloaderService } from './base/DownloaderService';
import { ReadComicsOnline } from '~src/resources/sourceUrls';
import { downloadComicImage } from '~src/helpers/downloadHelper';
import cheerio from 'cheerio';

export class ReadComicsOnlineService extends DownloaderService {
	private COMIC_ISSUE_URL_FORMAT = '/comic/%COMIC_ID%/%ISSUE_NUMBER%';
	private COMIC_ISSUE_PAGE_URL_FORMAT =
		'/comic/%COMIC_ID%/%ISSUE_NUMBER%/%ISSUE_PAGE%';
	private COMIC_URL_FORMAT = '/comic/%COMIC_ID%';

	constructor(imageDirectory: string) {
		super(ReadComicsOnline, imageDirectory);
	}

	private getPages(cheerioData: CheerioStatic) {
		return cheerioData('select#page-list')[0].children.filter((elem) => {
			return elem.name === 'option';
		}).length;
	}

	private async downloadImages(comic: string, issue: number, pages: number) {
		for (let page = 1; page <= pages; page++) {
			console.log(`Downloading ${comic} page ${page} of ${pages}`);
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

			const outputDirectory = `${this.imageDirectory}/${comic}/${issue}`;

			await downloadComicImage(imageUrl, outputDirectory, page);
		}
	}

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
		await this.downloadImages(comic, issue, pages);
	}

	public async getSeries(comic: string): Promise<void> {
		// Get Comic
		const response = await this.axiosInstance.get(
			this.COMIC_URL_FORMAT.replace('%COMIC_ID%', comic)
		);
	}
}
