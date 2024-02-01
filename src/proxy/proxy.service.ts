import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ProxyType } from "./types";

@Injectable()
export class ProxyService {
  baseProxyUrl: string;
  proxyAuthPort: string;
  constructor(private readonly configService: ConfigService) {
    this.baseProxyUrl = this.configService.getOrThrow<string>("PROXY_URL");
    this.proxyAuthPort =
      this.configService.getOrThrow<string>("PROXY_AUTH_PORT");
  }

  getProxy(countryCode = "il", proxyType: ProxyType = ProxyType.DATACENTER) {
    const proxyUrl = `${this.baseProxyUrl}-${countryCode.toLowerCase()}:${
      this.proxyAuthPort
    }`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);
    return proxyAgent;
  }
}
