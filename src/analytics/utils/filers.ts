import dayjs from "dayjs";

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
      travelorGeo: { $first: "$travelor_geoloc" },
      travelorDistance: { $first: "$travelor_distance" },
      travelorSearchQuery: { $first: "$travelor_search_query" },
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
      travelorGeo: 1,
      travelorDistance: 1,
      travelorSearchQuery: 1,
    },
  },
];

export const filterAllBookingHotel = (bookingJobId: string) => [
  {
    $match: {
      jobId: bookingJobId,
      createdAt: { $gte: dayjs().subtract(1, "day").toDate() },
    },
  },
  {
    $group: {
      _id: "$title",
      title: { $first: "$title" },
      stars: { $first: "$stars" },
      rate: { $first: "$rate" },
      bookingDistance: { $first: "$distance" },
      picture_link: { $first: "$picture_link" },
      bookingPrice: { $min: "$price.amount" },
      bookingCurrency: { $first: "$price.currency" },
      bookingLink: { $first: "$booking_link" },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      stars: 1,
      rate: 1,
      picture_link: 1,
      bookingPrice: 1,
      bookingCurrency: 1,
      bookingLink: 1,
      bookingDistance: 1,
    },
  },
];
