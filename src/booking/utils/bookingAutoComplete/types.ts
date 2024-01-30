export interface BookingAutoCompleteResult {
  b_max_los_data: BMaxLosData;
  b_show_entire_homes_checkbox: boolean;
  cc1: string;
  cjk: boolean;
  dest_id: string;
  placeId: string;
  dest_type: string;
  destType: string;
  label: string;
  label1: string;
  label2: string;
  labels: Label[];
  latitude: number;
  lc: string;
  longitude: number;
  nr_homes: number;
  nr_hotels: number;
  nr_hotels_25: number;
  photo_uri: string;
  roundtrip: string;
  rtl: boolean;
  value: string;
  place: any;
}

export interface BMaxLosData {
  defaultLos: number;
  extendedLos: number;
  experiment: string;
  fullOn: boolean;
}

export interface Label {
  text: string;
  precomposed: string;
  hl: number;
  dest_type: string;
  dest_id: string;
}
