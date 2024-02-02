import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpsProxyAgent } from "https-proxy-agent";
import { BRIGHTDATA_URL } from "./constants";
import { SUPPORTED_COUNTRIES } from "./constants/supportCountries";
import { DEFAULT_COUNTRY, ProxyType } from "./types";
import { IpInfo } from "./types/ipInfo";

@Injectable()
export class ProxyService implements OnModuleInit {
  baseProxyUrl: string;
  proxyAuthPort: string;
  opsToken: string;
  zone: string;

  constructor(private readonly configService: ConfigService) {
    this.baseProxyUrl = this.configService.getOrThrow<string>("PROXY_URL");
    this.proxyAuthPort =
      this.configService.getOrThrow<string>("PROXY_AUTH_PORT");
    this.opsToken = this.configService.getOrThrow<string>("PROXY_OPS_TOKEN");
    this.zone = this.configService.getOrThrow<string>("PROXY_ZONE");
  }

  onModuleInit() {
    this.addCurrentIPToWhitelist(this.zone);
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
    return fetch("http://lumtest.com/myip.json").then(
      async (res) => (await res.json()) as IpInfo
    );
  }
  /**
   *
   * @param zone proxy zone, can be skipped to affect all zones
   */
  private async addCurrentIPToWhitelist(zone?: string): Promise<boolean> {
    try {
      const { ip } = await this.getCurrentIP();
      console.log(`addCurrentIPToWhitelist zone ${zone} ip ${ip}`);
      return await fetch(`${BRIGHTDATA_URL}/zone/whitelist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.opsToken}`,
        },
        body: JSON.stringify({
          zone,
          ip,
        }),
      }).then((res) => {
        if (res.ok) {
          console.log("addCurrentIPToWhitelist success");
          return res.ok;
        }
        throw new Error("addCurrentIPToWhitelist error");
      });
    } catch (error) {
      console.error("addCurrentIPToWhitelist error", error);
      return false;
    }
  }
}
