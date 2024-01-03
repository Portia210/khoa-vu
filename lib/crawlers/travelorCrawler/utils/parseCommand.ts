import dayjs from "dayjs"

export const parseCommand = (command: any) => {
  const convertedData = {
    aggregator: "travolutionary",
    type: "geoloc",
    query_type: "destination",
    latitude: "?",
    longitude: "?",
    radius: 500,
    place_id: "?",
    check_in: "?",
    check_out: "?",
    country: "VN",
    currency: "USD",
    net: 0,
    query_text: "?",
    guests: "a"
  }

  // Fill in the values from the original data
  convertedData.latitude = command.latitude || "?"
  convertedData.longitude = command.longitude || "?"
  convertedData.place_id = command.place_id || "?"
  convertedData.check_in = dayjs(command.checkInDate).format("YYYY-MM-DD")
  convertedData.check_out = dayjs(command.checkOutDate).format("YYYY-MM-DD")
  convertedData.query_text = command.destination || "?"

  return convertedData
}
