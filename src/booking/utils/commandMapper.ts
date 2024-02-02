import dayjs from "dayjs";
import { defaultGraphqlVariablesInput } from "../constants/api";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import isNumber from "lodash/isNumber";

export const commandMapper = (command: CrawlerCommand) => {
  const isDestId = isNumber(command?.destination?.placeId);
  const variableInput = defaultGraphqlVariablesInput.input;
  variableInput.dates = {
    checkin: dayjs(command.checkInDate).format("YYYY-MM-DD"),
    checkout: dayjs(command.checkOutDate).format("YYYY-MM-DD"),
  };
  if (isDestId) {
    variableInput.location = {
      searchString: command?.destination?.destination,
      destType: command?.destination?.dest_type?.toLocaleUpperCase(),
      destId: parseInt(command?.destination?.placeId),
      latitude: command?.destination?.lat,
      longitude: command?.destination?.lng,
    };
  } else {
    variableInput.location = {
      searchString: command?.destination?.destination,
      destType: "LATLONG",
      latitude: command?.destination?.lat,
      longitude: command?.destination?.lng,
    };
  }
  variableInput.nbRooms = command.rooms;
  variableInput.nbAdults = command.adult;
  variableInput.nbChildren = command.children;
  variableInput.childrenAges = command.childrenAges;
  return {
    ...defaultGraphqlVariablesInput,
    input: variableInput,
  };
};
