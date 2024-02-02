export interface BOOKING_VARIABLES_INPUT {
  input: BOOKING_INPUT;
  geniusVipUI: GeniusVipUi;
  carouselLowCodeExp: boolean;
}

export interface BOOKING_INPUT {
  acidCarouselContext: any;
  childrenAges: any[];
  dates: Dates;
  doAvailabilityCheck: boolean;
  encodedAutocompleteMeta: any;
  enableCampaigns: boolean;
  filters: Filters;
  forcedBlocks: any;
  location: Location;
  metaContext: MetaContext;
  nbRooms: number;
  nbAdults: number;
  nbChildren: number;
  showAparthotelAsHotel: boolean;
  needsRoomsMatch: boolean;
  optionalFeatures: OptionalFeatures;
  pagination: Pagination;
  referrerBlock: any;
  sorters: Sorters;
  travelPurpose: number;
  seoThemeIds: any[];
  useSearchParamsFromSession: boolean;
  merchInput: MerchInput;
}

export interface Dates {
  checkin: string;
  checkout: string;
}

export interface Filters {}

export interface Location {
  searchString: string;
  destType: string;
  destId?: number;
  latitude?: number;
  longitude?: number;
}

export interface MetaContext {
  metaCampaignId: number;
  externalTotalPrice: any;
  feedPrice: any;
  hotelCenterAccountId: any;
  rateRuleId: any;
  dragongateTraceId: any;
  pricingProductsTag: any;
}

export interface OptionalFeatures {
  forceArpExperiments: boolean;
  testProperties: boolean;
}

export interface Pagination {
  rowsPerPage: number;
  offset: number;
}

export interface Sorters {
  selectedSorter: any;
  referenceGeoId: any;
  tripTypeIntentId: any;
}

export interface MerchInput {
  testCampaignIds: any[];
}

export interface GeniusVipUi {
  enableEnroll: boolean;
  page: string;
}
