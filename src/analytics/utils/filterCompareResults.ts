const filterCompareResults = (hotels: any[]) => {
  const totalResults = hotels.length;
  const totalBookingCheaperHotels = hotels.filter(
    (hotel) => Number(hotel.price_difference) > 0
  ).length;
  const totalTravelorCheaperHotels = hotels.filter(
    (hotel) => Number(hotel.price_difference) < 0
  ).length;
  const bookingCheaperHotelsInPercentage =
    (totalBookingCheaperHotels / totalResults) * 100;
  const travelorCheaperHotelsInPercentage =
    100 - bookingCheaperHotelsInPercentage;
  const avgPriceDifference =
    hotels.reduce((acc, hotel) => acc + Number(hotel.price_difference), 0) /
    totalResults;
  const minPriceDifference = Math.min(
    ...hotels.map((hotel) => Number(hotel.price_difference))
  );
  const maxPriceDifference = Math.max(
    ...hotels.map((hotel) => Number(hotel.price_difference))
  );
  return {
    totalResults,
    totalBookingCheaperHotels,
    totalTravelorCheaperHotels,
    travelorCheaperHotelsInPercentage,
    avgPriceDifference,
    minPriceDifference,
    maxPriceDifference,
  };
};
export { filterCompareResults };
