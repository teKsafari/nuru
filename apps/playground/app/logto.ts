export const logtoConfig = {
  endpoint: 'https://id.teksafari.org/',
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.LOGTO_BASE_URL!, // Change to your own base URL
  cookieSecret: 'tZzglr5H0C1W32ojWJiULAQB1ohkXvnK', // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === 'production',
};