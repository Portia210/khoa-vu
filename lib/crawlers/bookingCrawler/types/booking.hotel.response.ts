export interface BookingHotelResponse {
  searchQueries: SearchQueries
}

export interface SearchQueries {
  search: Search
}

export interface Search {
  destinationLocation: DestinationLocation
  searchMeta: SearchMeta
  filters: Filter[]
  pagination: Pagination
  results: BookingHotelResult[]
}

export interface DestinationLocation {
  name: Name
  countryCode: string
  inName: InName
  __typename: string
}

export interface Name {
  text: string
  __typename: string
}

export interface InName {
  __typename: string
  text: string
}

export interface Paragraph {
  __typename: string
  text: string
}

export interface SearchMeta {
  destType: string
  affiliateVerticalType: string
  nbAdults: number
  destId: number
  boundingBoxes: BoundingBox[]
  maxLengthOfStayInDays: number
  __typename: string
  nbRooms: number
  userHasSelectedFilters: boolean
  affiliatePartnerChannelId: number
  customerValueStatus: string
  availabilityInfo: AvailabilityInfo
  isAffiliateBookingOwned: boolean
  dates: Dates
  nbChildren: number
  childrenAges: any[]
}

export interface BoundingBox {
  neLon: number
  type: string
  __typename: string
  neLat: number
  swLat: number
  swLon: number
}

export interface AvailabilityInfo {
  unavailabilityPercent: number
  __typename: string
  totalAvailableNotAutoextended: number
  hasLowAvailability: boolean
}

export interface Dates {
  __typename: string
  checkout: string
  lengthOfStayInDays: number
  checkin: string
}

export interface Filter {
  name: string
  options: Option[]
  __typename: string
  title: Title
  filterLayout: FilterLayout
  category: string
  trackOnView: any[]
  filterStyle: string
  stepperOptions: StepperOption[]
  trackOnClick: any[]
  sliderOptionsPerStay: SliderOptionsPerStay
  subtitle: string
  field: string
  sliderOptions: SliderOptions
}

export interface Option {
  urlId: string
  __typename: string
  trackOnSelectPopular: any[]
  selected: boolean
  starRating: StarRating
  additionalLabel: AdditionalLabel
  optionId: number
  trackOnSelect: any[]
  trackOnViewPopular: any[]
  trackOnView: any[]
  count: number
  trackOnDeSelectPopular: any[]
  trackOnClickPopular: any[]
  value: Value
  trackOnDeSelect: any[]
}

export interface StarRating {
  tocLink: TocLink
  caption: Caption
  showAdditionalInfoIcon: boolean
  symbol: string
  value: number
}

export interface Caption {
  translation?: string
  __typename: string
}

export interface AdditionalLabel {
  translationTag: TranslationTag
  __typename: string
  text: string
}

export interface TranslationTag {
  translation: any
  __typename: string
}

export interface Value {
  translationTag: TranslationTag2
  __typename: string
  text: string
}

export interface TranslationTag2 {
  translation?: string
  __typename: string
}

export interface Title {
  text: string
  __typename: string
  translationTag: TranslationTag3
}

export interface TranslationTag3 {
  translation?: string
  __typename: string
}

export interface FilterLayout {
  __typename: string
  collapsedCount: number
  isCollapsable: boolean
}

export interface StepperOption {
  trackOnIncrease: any[]
  min: number
  field: string
  default: number
  trackOnDeSelect: any[]
  max: number
  selected: number
  labels: Label[]
  trackOnClickDecrease: any[]
  __typename: string
  trackOnClickIncrease: any[]
  title: Title2
  trackOnView: any[]
  trackOnSelect: any[]
  trackOnDecrease: any[]
}

export interface Label {
  translationTag: TranslationTag4
  text: string
  __typename: string
}

export interface TranslationTag4 {
  __typename: string
  translation: any
}

export interface Title2 {
  translationTag: TranslationTag5
  text: string
  __typename: string
}

export interface TranslationTag5 {
  translation: any
  __typename: string
}

export interface SliderOptionsPerStay {
  minSelected: string
  selectedRange: any
  histogram: any[]
  minPriceStep: string
  __typename: string
  maxSelected: string
  min: string
  title: string
  minSelectedFormatted: any
  currency: string
  max: string
}

export interface SliderOptions {
  max: string
  currency: string
  minSelectedFormatted?: string
  title: string
  min: string
  maxSelected: string
  __typename: string
  minPriceStep: string
  selectedRange: any
  histogram: number[]
  minSelected: string
}

export interface Pagination {
  __typename: string
  nbResultsPerPage: number
  nbResultsTotal: number
}

export interface BookingHotelResult {
  relocationMode: any
  blocks: Block[]
  matchingUnitConfigurations: MatchingUnitConfigurations
  showAdLabel: boolean
  policies: Policies
  persuasion: Persuasion
  recommendedDatesLabel: any
  soldOutInfo: SoldOutInfo
  acceptsWalletCredit: boolean
  inferredLocationScore: number
  customBadges: CustomBadges
  showPrivateHostMessage: boolean
  bundleRatesAvailable: boolean
  displayName: DisplayName
  trackOnView: any[]
  propertySustainability: PropertySustainability
  nbWishlists: number
  mealPlanIncluded?: MealPlanIncluded
  geniusInfo: any
  isNewlyOpened: boolean
  bookerExperienceContentUIComponentProps: any[]
  seoThemes: any[]
  description: any
  isTpiExclusiveProperty: boolean
  topPhotos: any[]
  priceDisplayInfoIrene: PriceDisplayInfoIrene
  visibilityBoosterEnabled?: boolean
  recommendedDate: RecommendedDate
  ribbon?: Ribbon
  hostTraderLabel: string
  basicPropertyData: BookingBasicPropertyData
  __typename: string
  licenseDetails: any
  location: HotelLocation
  badges: any[]
  showGeniusLoginMessage: boolean
}

export interface Block {
  hasCrib: boolean
  __typename: string
  blockMatchTags: BlockMatchTags
  blockId: BlockId
  freeCancellationUntil?: string
  originalPrice: OriginalPrice
  thirdPartyInventoryContext: ThirdPartyInventoryContext
  onlyXLeftMessage?: OnlyXleftMessage
  finalPrice: FinalPrice
}

export interface BlockMatchTags {
  childStaysForFree: boolean
  __typename: string
}

export interface BlockId {
  packageId: string
  policyGroupId: string
  occupancy: number
  mealPlanId: number
  __typename: string
  roomId: string
}

export interface OriginalPrice {
  __typename: string
  amount: number
  currency: string
}

export interface ThirdPartyInventoryContext {
  isTpiBlock: boolean
  __typename: string
}

export interface OnlyXleftMessage {
  tag: any
  __typename: string
  variables: any[]
  translation: string
}

export interface FinalPrice {
  __typename: string
  amount: number
  currency: string
}

export interface MatchingUnitConfigurations {
  commonConfiguration: CommonConfiguration
  unitConfigurations: UnitConfiguration[]
  __typename: string
}

export interface CommonConfiguration {
  nbAllBeds: number
  nbBedrooms: number
  bedConfigurations: BedConfiguration[]
  unitTypeNames: UnitTypeName[]
  unitId: number
  nbBathrooms: number
  name: any
  localizedArea?: LocalizedArea
  __typename: string
  nbKitchens: number
  nbUnits: number
  nbLivingrooms: number
}

export interface BedConfiguration {
  beds: Bed[]
  __typename: string
  nbAllBeds: number
}

export interface Bed {
  count: number
  __typename: string
  type: number
}

export interface UnitTypeName {
  __typename: string
  translation: string
}

export interface LocalizedArea {
  unit: string
  localizedArea: string
  __typename: string
}

export interface UnitConfiguration {
  nbBathrooms: number
  name: string
  __typename: string
  nbLivingrooms: number
  unitTypeId: number
  unitId: number
  localizedArea?: LocalizedArea2
  nbKitchens: number
  nbUnits: number
  apartmentRooms: ApartmentRoom[]
  nbAllBeds: number
  nbBedrooms: number
  bedConfigurations: BedConfiguration2[]
  unitTypeNames: UnitTypeName2[]
}

export interface LocalizedArea2 {
  localizedArea: string
  unit: string
  __typename: string
}

export interface ApartmentRoom {
  config: Config
  __typename: string
  roomName: RoomName
}

export interface Config {
  bedTypeId: number
  roomId: number
  __typename: string
  bedCount: number
  roomType: string
}

export interface RoomName {
  tag: string
  __typename: string
  translation: string
}

export interface BedConfiguration2 {
  nbAllBeds: number
  __typename: string
  beds: Bed2[]
}

export interface Bed2 {
  type: number
  count: number
  __typename: string
}

export interface UnitTypeName2 {
  translation: string
  __typename: string
}

export interface Policies {
  enableJapaneseUsersSpecialCase: any
  __typename: string
  showNoPrepayment: boolean
  showFreeCancellation: boolean
}

export interface Persuasion {
  nativeAdsCpc: any
  geniusRateAvailable: boolean
  preferredPlus: boolean
  nativeAdsTracking: any
  __typename: string
  highlighted: boolean
  bookedXTimesMessage: any
  preferred: boolean
  showNativeAdLabel: boolean
  autoextended: boolean
  sponsoredAdsData: any
  nativeAdId: any
}

export interface SoldOutInfo {
  __typename: string
  alternativeDatesMessages: any[]
  messages: any[]
  isSoldOut: boolean
}

export interface CustomBadges {
  showOnlineCheckinBadge: any
  __typename: string
  showParkAndFly: boolean
  showIsWorkFriendly: boolean
  showBhTravelCreditBadge: boolean
  showSkiToDoor: boolean
}

export interface DisplayName {
  __typename: string
  text: string
  translationTag: TranslationTag6
}

export interface TranslationTag6 {
  translation: any
  __typename: string
}

export interface PropertySustainability {
  tier: Tier
  isSustainable: boolean
  facilities?: Facility[]
  certifications: any
  levelId: string
  chainProgrammes: any
  __typename: string
}

export interface Tier {
  __typename: string
  type: string
}

export interface Facility {
  id: number
  __typename: string
}

export interface MealPlanIncluded {
  mealPlanType: string
  __typename: string
  text: string
}

export interface PriceDisplayInfoIrene {
  excludedCharges: ExcludedCharges
  __typename: string
  displayPrice: DisplayPrice
  chargesInfo: ChargesInfo
  priceBeforeDiscount: PriceBeforeDiscount
  badges: Badge[]
  discounts: Discount[]
  useRoundedAmount: boolean
  rewards: Rewards
  taxExceptions: any[]
}

export interface ExcludedCharges {
  excludeChargesList: ExcludeChargesList[]
  excludeChargesAggregated: ExcludeChargesAggregated
  __typename: string
}

export interface ExcludeChargesList {
  chargeType: number
  chargeInclusion: string
  chargeMode: string
  __typename: string
  amountPerStay: AmountPerStay
}

export interface AmountPerStay {
  amount: string
  __typename: string
  currency: string
  amountRounded: string
  amountUnformatted: number
}

export interface ExcludeChargesAggregated {
  copy: Copy
  amountPerStay: AmountPerStay
  __typename: string
}

export interface Copy {
  __typename: string
  translation: any
}

export interface DisplayPrice {
  amountPerStay: AmountPerStay
  copy: Copy
}

export interface ChargesInfo {
  __typename: string
  translation: string
}

export interface PriceBeforeDiscount {
  amountPerStay: AmountPerStay
  __typename: string
  copy: Copy
}

export interface Badge {
  identifier: string
  name: Name
  tooltip: Tooltip
  style: string
  __typename: string
}

export interface Tooltip {
  translation: string
  __typename: string
}

export interface Discount {
  itemType: string
  name: Name
  __typename: string
  description: Description
  amount: Amount
  productId: string
}

export interface Description {
  translation: string
  __typename: string
}

export interface Amount {
  currency: string
  amount: string
  __typename: string
  amountUnformatted: number
  amountRounded: string
}

export interface Rewards {
  rewardsAggregated: RewardsAggregated
  rewardsList: any[]
  __typename: string
}

export interface RewardsAggregated {
  copy: Copy
  __typename: string
  amountPerStay: AmountPerStay
}

export interface RecommendedDate {
  checkin: string
  lengthOfStay: number
  __typename: string
  checkout: string
}

export interface Ribbon {
  __typename: string
  ribbonType: string
  text: string
}

export interface BookingBasicPropertyData {
  __typename: string
  photos: BookingHotelPhotos
  location: HotelLocation
  accommodationTypeId: number
  starRating?: StarRating
  pageName: string
  isTestProperty: boolean
  isClosed: boolean
  ufi: number
  id: number
  reviewScore: ReviewScore
  externalReviewScore?: ExternalReviewScore
  alternativeExternalReviewsScore: any
}

export interface BookingHotelPhotos {
  __typename: string
  main: Main
}

export interface Main {
  __typename: string
  lowResUrl: LowResUrl
  highResJpegUrl: HighResJpegUrl
  highResUrl: HighResUrl
  lowResJpegUrl: LowResJpegUrl
}

export interface LowResUrl {
  __typename: string
  relativeUrl: string
}

export interface HighResJpegUrl {
  __typename: string
  relativeUrl: string
}

export interface HighResUrl {
  __typename: string
  relativeUrl: string
}

export interface LowResJpegUrl {
  relativeUrl: string
  __typename: string
}

export interface Location {
  countryCode: string
  __typename: string
  address: string
  city: string
}

export interface TocLink {
  translation?: string
  __typename: string
}

export interface ReviewScore {
  reviewCount: number
  score: number
  showSecondaryScore: boolean
  secondaryScore: number
  __typename: string
  showScore: boolean
  secondaryTextTag: SecondaryTextTag
  totalScoreTextTag: TotalScoreTextTag
}

export interface SecondaryTextTag {
  translation?: string
  __typename: string
}

export interface TotalScoreTextTag {
  translation: string
  __typename: string
}

export interface ExternalReviewScore {
  __typename: string
  totalScoreTextTag: TotalScoreTextTag
  showScore: boolean
  reviewCount: number
  score: number
}

export interface HotelLocation {
  displayLocation: string
  beachWalkingTime: any
  mainDistance: string
  skiLiftDistance: any
  publicTransportDistanceDescription: any
  __typename: string
  geoDistanceMeters: any
  beachDistance: any
  nearbyBeachNames: any[]
}
