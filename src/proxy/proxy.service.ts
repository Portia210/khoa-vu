import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpsProxyAgent } from "https-proxy-agent";

@Injectable()
export class ProxyService {
  baseProxyUrl: string;
  proxyAuthPort: string;
  constructor(private readonly configService: ConfigService) {
    this.baseProxyUrl = this.configService.getOrThrow<string>("PROXY_URL");
    this.proxyAuthPort =
      this.configService.getOrThrow<string>("PROXY_AUTH_PORT");
  }

  getProxy(countryCode: string) {
    if (!countryCode) throw new Error("Country code is required");
    const proxyUrl = `${this.baseProxyUrl}-${countryCode.toLowerCase()}:${
      this.proxyAuthPort
    }`;
    console.log("proxyUrl", proxyUrl);
    const proxyAgent = new HttpsProxyAgent(proxyUrl);
    return proxyAgent;
  }
}
