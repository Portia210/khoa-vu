import axios from "axios";
import { bookingQuery, bookingVariables } from "./bookingAutoCompleteConfig";
import { BookingAutoCompleteResult } from "./types";

const bookingAutoComplete = async (
  query: string,
  version: "v1" | "v2" = "v2"
): Promise<BookingAutoCompleteResult[]> => {
  if (version === "v1") return bookingAutoCompleteV1(query);
  return bookingAutoCompleteV2(query);
};

const bookingAutoCompleteV1 = async (
  query: string
): Promise<BookingAutoCompleteResult[]> => {
  const url = `https://accommodations.booking.com/autocomplete.json`;
  const response = await axios
    .post(url, {
      query,
      language: "en",
      size: 5,
    })
    .then((res) => res?.data);
  return response?.results || [];
};

const bookingAutoCompleteV2 = async (
  query: string
): Promise<BookingAutoCompleteResult[]> => {
  const url = `https://www.booking.com/dml/graphql`;
  let variables = bookingVariables;
  variables.input.searchString = query;
  const data = {
    operationName: "SearchPlaces",
    variables,
    ...bookingQuery,
  };
  const response = await axios
    .post(`${url}?lang="en-gb"`, data)
    .then((res) => res?.data);
  return response?.data?.searchPlaces?.results || [];
};

const filterBookingResult = (result: BookingAutoCompleteResult) => {
  return {
    placeId: result?.dest_id || result?.placeId,
    address: result?.label,
    dest_type: result?.dest_type || result?.destType,
    lat: result?.latitude || result?.place?.location.latitude,
    lng: result?.longitude || result?.place?.location.longitude,
  };
};

const autoSelectPlace = async (destination: string | undefined) => {
  if (!destination) throw new Error("Destination is required");
  let results = await bookingAutoComplete(destination, "v1");
  if (!results?.length || results.length === 0)
    results = await bookingAutoComplete(destination, "v2");
  const places = results?.map((item) => filterBookingResult(item)) || [];
  if (!places.length) throw new Error("No places found");
  const place = places.shift();
  return {
    placeId: place?.placeId,
    destination: place?.address,
    dest_type: place?.dest_type,
    lat: place?.lat,
    lng: place?.lng,
  };
};

export {
  autoSelectPlace,
  bookingAutoComplete,
  bookingAutoCompleteV2,
  filterBookingResult
};

