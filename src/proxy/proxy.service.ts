import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpsProxyAgent } from "https-proxy-agent";
import { BRIGHTDATA_URL } from "./constants";
import { SUPPORTED_COUNTRIES } from "./constants/supportCountries";
import { DEFAULT_COUNTRY, ProxyType } from "./types";
import { IpInfo } from "./types/ipInfo";

@Injectable()
export class ProxyService implements OnModuleInit, OnApplicationShutdown {
  environment: string | undefined = process.env.NODE_ENV;
  baseProxyUrl: string;
  proxyAuthPort: string;
  opsToken: string;
  zone: string;
  ip: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.environment = this.configService.get<string>("NODE_ENV");
    this.baseProxyUrl = this.configService.getOrThrow<string>("PROXY_URL");
    this.proxyAuthPort =
      this.configService.getOrThrow<string>("PROXY_AUTH_PORT");
    this.opsToken = this.configService.getOrThrow<string>("PROXY_OPS_TOKEN");
    this.zone = this.configService.getOrThrow<string>("PROXY_ZONE");
  }
  onApplicationShutdown(signal?: string) {
    if (this.environment !== "production") return;
    this.addRemoveCurrentIPToWhitelist(this.zone, "DELETE");
  }

  onModuleInit() {
    if (this.environment !== "production") return;
    console.log("ProxyService initialized in", this.environment, "mode");
    this.addRemoveCurrentIPToWhitelist(this.zone, "POST");
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

  private async getCurrentIP(): Promise<IpInfo> {
    const result = await fetch("http://lumtest.com/myip.json").then(
      async (res) => (await res.json()) as IpInfo
    );
    this.ip = result.ip;
    return result;
  }
  /**
   *  Add/Remove current IP to the proxy zone whitelist
   * @param zone proxy zone, can be skipped to affect all zones
   */
  private async addRemoveCurrentIPToWhitelist(
    zone: string,
    method: "POST" | "DELETE"
  ): Promise<boolean> {
    try {
      if (!this.ip) await this.getCurrentIP();
      if (method === "POST") {
        console.log(`addCurrentIPToWhitelist zone ${zone} ip ${this.ip}`);
      } else {
        console.log(`removeCurrentIPToWhitelist zone ${zone} ip ${this.ip}`);
      }
      return await fetch(`${BRIGHTDATA_URL}/zone/whitelist`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.opsToken}`,
        },
        body: JSON.stringify({
          zone,
          ip: this.ip,
        }),
      }).then((res) => res.ok);
    } catch (error) {
      console.error("addRemoveCurrentIPToWhitelist error", error);
      return false;
    }
  }
}
