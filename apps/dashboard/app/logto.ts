export const logtoConfig = {
  endpoint: 'https://id.teksafari.org/',
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.LOGTO_BASE_URL!,
  cookieSecret: 'R2kqMotlL5pvErNxTm1DvToTPkuUi9iQ', // 32 digit secret for dashboard
  cookieSecure: process.env.NODE_ENV === 'production',
  // In a real scenario, you'd add scopes for RBAC here
  // resources: ['https://api.nuru-platform.com'],
  scopes: [
    'roles',
    'organizations',
    'create:lesson',
    'edit:own_lesson',
    'delete:own_lesson',
    'publish:marketplace',
    'read:analytics',
  ],
};
