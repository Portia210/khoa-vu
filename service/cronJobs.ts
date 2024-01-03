import { BASE_URL } from "~lib/constants/enviroment"

import type { CrawlerJobDto } from "./types/CrawlerJobDto"

export class CronJobs {
  static async fetchJobs() {
    setInterval(async () => {
      const jobs: CrawlerJobDto[] = await fetch(`${BASE_URL}/api/jobs`).then(
        (res) => res.json()
      )
      console.log("jobs:::", jobs)
    }, 3000)
  }
}
