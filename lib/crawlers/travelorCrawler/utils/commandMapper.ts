import dayjs from "dayjs"
import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"

export const commandMapper = (command: CrawlerCommand) => {
  const result = {
    aggregator: "travolutionary",
    type: "geoloc",
    latitude: command?.destination?.lat,
    longitude: command?.destination?.lng,
    radius: 500,
    place_id: command?.destination?.placeId,
    check_in: dayjs(command?.checkInDate).format("YYYY-MM-DD"),
    check_out: dayjs(command?.checkOutDate).format("YYYY-MM-DD"),
    country: "US",
    currency: "USD",
    net: 0,
    query_text: command?.destination?.destination,
    guests: command?.guests || "a"
  }
  return result
}
