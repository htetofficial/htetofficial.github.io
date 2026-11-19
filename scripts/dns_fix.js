// scripts/dns_fix.js
// Overrides default DNS server to Cloudflare (1.1.1.1) and Google (8.8.8.8)
// to resolve api.cloudflare.com and bypass local UDP DNS packet truncation.

const dns = require('dns');
try {
  dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8']);
} catch (e) {
  // ignore
}
