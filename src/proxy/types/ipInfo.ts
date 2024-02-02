export interface IpInfo {
  ip: string;
  country: string;
  asn: Asn;
  geo: Geo;
}

export interface Asn {
  asnum: number;
  org_name: string;
}

export interface Geo {
  city: string;
  region: string;
  region_name: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  tz: string;
  lum_city: string;
  lum_region: string;
}
