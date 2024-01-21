import { DATA_SOURCES } from '../constants/dataSources';
import { BASE_URL } from '../constants/enviroment';
import { CrawlerCommand } from '../types/CrawlerCommand';

export class CrawlerCommandService {
  static async fetchJobs(dataSource: DATA_SOURCES) {
    const jobs: CrawlerCommand[] = await fetch(
      `${BASE_URL}/api/jobs?dataSource=${dataSource}`,
    ).then((res) => res.json());
    return jobs;
  }
}
