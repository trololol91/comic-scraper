export interface IDownloaderService {
	getIssue(comic: string, issue: number): void;
	getSeries(comic: string): void;
}
