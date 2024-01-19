import { DATA_SOURCES } from "~lib/constants/dataSources"
import { BASE_URL } from "~lib/constants/enviroment"
import { bookingCrawlerMediator } from "~lib/mediators/bookingCrawlerMediator"
import { travelorCrawlerMediator } from "~lib/mediators/travelorCrawlerMediator"
import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"

export class CronJobs {
  static async fetchJobs() {
    // return setInterval(async () => {
    //   const jobs: CrawlerCommand[] = await fetch(`${BASE_URL}/api/jobs`).then(
    //     (res) => res.json()
    //   )
    //   for (const job of jobs) {
    //     CronJobs.handleCronJobResult(job)
    //   }
    // }, 3000)
  }

  private static async handleCronJobResult(job: CrawlerCommand) {
    if (!job) return
    if (job?.dataSource?.toLocaleLowerCase() === DATA_SOURCES.TRAVELOR) {
      console.log("Starting travelor crawler")
      await travelorCrawlerMediator.startAuthentication(job)
    } else if (job?.dataSource.toLocaleLowerCase() === DATA_SOURCES.BOOKING) {
      console.log("Starting booking crawler")
      await bookingCrawlerMediator.startAuthentication(job)
    } else {
      console.log("Unknown data source", job?.dataSource)
    }
  }
}
