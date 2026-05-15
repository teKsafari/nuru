export const logtoConfig = {
  endpoint: 'https://id.teksafari.org/',
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.LOGTO_BASE_URL!,
  cookieSecret: 'v6Kx9w3M2p5Z1r8N4t7Y0u9I2o5L3s1A', // 32 digit secret for dashboard
  cookieSecure: process.env.NODE_ENV === 'production',
  // In a real scenario, you'd add scopes for RBAC here
  scopes: ['roles', 'organizations'],
};
