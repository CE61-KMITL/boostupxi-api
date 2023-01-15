export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  whitelist_domains: process.env.WHITELISTED_DOMAINS,
});
