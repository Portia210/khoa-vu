import { HttpsProxyAgent } from 'https-proxy-agent';

const proxyUrl = process.env.PROXY_URL ||
  'http://brd-customer-hl_f1601859-zone-datacenter_proxy1:e0ggk3jpoeja@brd.superproxy.io:22225';
console.log('proxyUrl', proxyUrl);
export const proxyAgent = new HttpsProxyAgent(proxyUrl);
