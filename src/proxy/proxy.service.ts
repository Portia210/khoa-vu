import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpsProxyAgent } from "https-proxy-agent";
import { DEFAULT_COUNTRY, ProxyType } from "./types";
import { SUPPORTED_COUNTRIES } from "./constants/supportCountries";

@Injectable()
export class ProxyService {
  baseProxyUrl: string;
  proxyAuthPort: string;
  constructor(private readonly configService: ConfigService) {
    this.baseProxyUrl = this.configService.getOrThrow<string>("PROXY_URL");
    this.proxyAuthPort =
      this.configService.getOrThrow<string>("PROXY_AUTH_PORT");
  }

  getProxy(
    countryCode = DEFAULT_COUNTRY,
    proxyType: ProxyType = ProxyType.DATACENTER
  ) {
    const country = SUPPORTED_COUNTRIES.get(countryCode);
    if (!country) countryCode = DEFAULT_COUNTRY;
    const proxyUrl = `${this.baseProxyUrl}-${countryCode.toLowerCase()}:${
      this.proxyAuthPort
    }`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);
    return proxyAgent;
  }
}
