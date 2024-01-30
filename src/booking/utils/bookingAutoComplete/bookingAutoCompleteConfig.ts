export const bookingQuery = {
  query: `
      query SearchPlaces($input: SearchPlacesInput!, $fetchOnlyFirst: Boolean) {
        searchPlaces(input: $input) {
          results {
            label
            mainText
            secondaryText
            types
            position
            placeId
            destType
            placeType
            languageCode
            maxLengthOfStayInDays
            place(fetchOnlyFirst: $fetchOnlyFirst) {
              location {
                latitude
                longitude
                __typename
              }
              __typename
            }
            source
            encodedAutocompleteMeta
            __typename
          }
          __typename
        }
      }
    `,
};

export const bookingVariables = {
  input: {
    searchString: "London",
  },
  fetchOnlyFirst: false,
};
