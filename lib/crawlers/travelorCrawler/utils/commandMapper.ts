import dayjs from "dayjs"

export const commandMapper = (command: any) => {
  const result = {
    aggregator: "travolutionary",
    type: "geoloc",
    latitude: command?.destination?.lat,
    longitude: command?.destination?.lng,
    radius: 500,
    place_id: command?.destination?.placeId,
    check_in: dayjs(command?.checkInDate).format("YYYY-MM-DD"),
    check_out: dayjs(command?.checkOutDate).format("YYYY-MM-DD"),
    country: "VN",
    currency: "USD",
    net: 0,
    query_text: command?.destination?.destination,
    guests: "a"
  }

  console.log("commandMapper result:", result)
  return result
}
