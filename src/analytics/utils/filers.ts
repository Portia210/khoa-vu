import dayjs from "dayjs";
import stringSimilarity from "string-similarity";

export const filters = (bookingJobId: string, travelorJobId: string) => [
  {
    $lookup: {
      from: "travelorhotels",
      localField: "title",
      foreignField: "title",
      as: "matchedHotels",
    },
  },
  {
    $unwind: {
      path: "$matchedHotels",
    },
  },
  {
    $match: {
      matchedHotels: { $exists: true },
      createdAt: { $gte: dayjs().subtract(1, "day").toDate() },
      "matchedHotels.jobId": { $eq: travelorJobId },
      jobId: { $eq: bookingJobId },
    },
  },
  {
    $group: {
      _id: "$title",
      // Use $first to select the first occurrence of each title
      distance: { $first: "$distance" },
      title: { $first: "$title" },
      stars: { $first: "$matchedHotels.stars" },
      rate: { $first: "$rate" },
      picture_link: { $first: "$picture_link" },
      travelorPrice: { $min: "$matchedHotels.price.amount" },
      bookingPrice: { $first: "$price.amount" },
      bookingCurrency: { $first: "$price.currency" },
      travelorCurrency: { $first: "$matchedHotels.price.currency" },
      travelorLink: { $first: "$matchedHotels.travelor_link" },
      bookingLink: { $first: "$booking_link" },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      distance: 1,
      stars: 1,
      rate: 1,
      picture_link: 1,
      travelorPrice: 1,
      bookingPrice: 1,
      bookingCurrency: 1,
      travelorCurrency: 1,
      travelorLink: 1,
      bookingLink: 1,
    },
  },
];

export const filterAllTravelorHotel = (travelorJobId: string) => [
  {
    $match: {
      jobId: travelorJobId,
      createdAt: { $gte: dayjs().subtract(1, "day").toDate() },
    },
  },
  {
    $group: {
      _id: "$title",
      title: { $first: "$title" },
      stars: { $first: "$stars" },
      rate: { $first: "$reviews.rating" },
      picture_link: { $first: "$picture_link" },
      travelorPrice: { $min: "$price.amount" },
      travelorCurrency: { $first: "$price.currency" },
      travelorLink: { $first: "$travelor_link" },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      stars: 1,
      rate: 1,
      picture_link: 1,
      travelorPrice: 1,
      travelorCurrency: 1,
      travelorLink: 1,
    },
  },
];

function preprocessString(str: string) {
  // Remove spaces and punctuation characters
  return str.replace(/[^\w\s]/g, "").toLowerCase();
}

export const filterAllTravelorHotelV2 = (travelorJobId: string) => {
  const threshold = 0.95;
  return [
    {
      $match: {
        jobId: travelorJobId,
        createdAt: { $gte: dayjs().subtract(1, "day").toDate() },
      },
    },
    {
      $group: {
        _id: null,
        bookingHotelTitle: { $first: "$title" }, // Get the title of the booking hotel
      },
    },
    {
      $project: {
        _id: 0,
        bookingHotelTitle: 1,
      },
    },
    {
      $addFields: {
        processedSearchString: { $toLower: "$bookingHotelTitle" }, // Preprocess the booking hotel title
      },
    },
    {
      $addFields: {
        similarity: stringSimilarity.compareTwoStrings(
          "$processedTitle",
          "$processedSearchString"
        ),
      },
    },
    {
      $match: {
        similarity: { $gte: threshold }, // Filter based on similarity threshold
      },
    },
    {
      $group: {
        _id: "$title",
        title: { $first: "$title" },
        stars: { $first: "$stars" },
        rate: { $first: "$reviews.rating" },
        picture_link: { $first: "$picture_link" },
        travelorPrice: { $min: "$price.amount" },
        travelorCurrency: { $first: "$price.currency" },
        travelorLink: { $first: "$travelor_link" },
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        stars: 1,
        rate: 1,
        picture_link: 1,
        travelorPrice: 1,
        travelorCurrency: 1,
        travelorLink: 1,
      },
    },
  ];
};
