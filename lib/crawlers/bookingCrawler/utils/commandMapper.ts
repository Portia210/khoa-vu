import dayjs from "dayjs"

import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"

import { defaultGraphqlVariablesInput } from "../constants/api"

export const commandMapper = (command: CrawlerCommand) => {
  let variableInput = defaultGraphqlVariablesInput.input
  variableInput.dates = {
    checkin: dayjs(command.checkInDate).format("YYYY-MM-DD"),
    checkout: dayjs(command.checkOutDate).format("YYYY-MM-DD")
  }
  variableInput.location = {
    searchString: command?.destination?.destination,
    destType: command?.destination?.dest_type?.toLocaleUpperCase(),
    destId: parseInt(command?.destination?.placeId),
    latitude: command?.destination?.lat,
    longitude: command?.destination?.lng,
  }
  variableInput.nbRooms = command.rooms
  variableInput.nbAdults = command.adult
  variableInput.nbChildren = command.children
  variableInput.childrenAges = command.childrenAges
  return {
    ...defaultGraphqlVariablesInput,
    input: variableInput
  }
}
