# comic-scraper

Author: Richmond Lim

## Description

This project allows users to scrape and download comic books as images from download sites.

## Instructions

### Setup

1. pull the repository
1. run `npm install`

### To start downloading

- open `index.ts`
- at the bottom, change the downloadImages arguments to the
  - source - source to download the comic from. (getcomics or readcomicsonline)
  - comicDlId - the comic id, usually found in the url of the comic
  - issue number (optional) - providing this will only download one issue (not providing will download the whole series)
- then run `npm start`
- it should download the images and compress them to `output/<comic name>` folder

## Supported Sites

1. ReadComicsOnline

## Contributing

To contribute, make sure to add a service in `src/service` directory.

- A service should extend DownloaderService abstract class
  - The abstract class requires getIssue and getSeries function to be implemented
- A test must be written in `src/service/__tests__/` directory
  - You can add test resources in `src/service/__tests__/test_resource` directory
- Download sources must be added in index.ts's `getDownloadServiceOnSource` function

### Directory Structure

```
├── README.md
├── jest.config.js
├── package-lock.json
├── package.json
├── src
│   ├── helpers
│   │   ├── __tests__
│   │   │   └── downloadHelper.test.ts
│   │   └── downloadHelper.ts
│   ├── index.ts
│   ├── resources
│   │   └── sourceUrls.ts
│   └── services
│       ├── ReadComicsOnlineService.ts
│       ├── __tests__
│       │   ├── ReadComicsOnlineService.test.tsx
│       │   └── test_resource
│       └── base
│           ├── DownloaderService.ts
│           └── IDownloaderService.ts
└── tsconfig.json
```
