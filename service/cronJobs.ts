import { DATA_SOURCES } from "~lib/constants/dataSources"
import { BASE_URL } from "~lib/constants/enviroment"
import { bookingCrawlerMediator } from "~lib/mediators/bookingCrawlerMediator"
import { travelorCrawlerMediator } from "~lib/mediators/travelorCrawlerMediator"

import type { CrawlerJobDto } from "./types/CrawlerJobDto"

export class CronJobs {
  static async fetchJobs() {
    return setInterval(async () => {
      const jobs: CrawlerJobDto[] = await fetch(`${BASE_URL}/api/jobs`).then(
        (res) => res.json()
      )
      CronJobs.handleCronJobResult(jobs.shift())
    }, 3000)
  }

  private static async handleCronJobResult(job: CrawlerJobDto) {
    if (!job) return
    if (job?.dataSource?.toLocaleLowerCase() === DATA_SOURCES.TRAVELOR) {
      console.log("Starting travelor crawler")
      await travelorCrawlerMediator.startAuthentication(job)
    } else if (job?.dataSource.toLocaleLowerCase() === DATA_SOURCES.BOOKING) {
      console.log("Starting booking crawler")
      await bookingCrawlerMediator.startAuthentication()
    } else {
      console.log("Unknown data source", job?.dataSource)
    }
  }
}
