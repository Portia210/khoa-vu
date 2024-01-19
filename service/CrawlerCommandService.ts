
import { DATA_SOURCES } from "~lib/constants/dataSources"
import { BASE_URL } from "~lib/constants/enviroment"
import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"

export class CrawlerCommandService {
  static async fetchJobs(dataSource: DATA_SOURCES) {
    const jobs: CrawlerCommand[] = await fetch
      (`${BASE_URL}/api/jobs?dataSource=${dataSource}`)
      .then((res) => res.json())
    return jobs
  }
}
