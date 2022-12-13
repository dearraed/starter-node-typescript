"use strict";
exports.__esModule = true;
exports.seeder = exports.logDirectory = exports.tokenInfo = exports.corsUrl = exports.db = exports.port = exports.environment = void 0;
// Mapper for environment variables
exports.environment = process.env.NODE_ENV;
exports.port = process.env.PORT;
exports.db = {
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || ''
};
exports.corsUrl = process.env.CORS_URL;
exports.tokenInfo = {
    accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS || '0'),
    refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_DAYS || '0'),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || ''
};
exports.logDirectory = process.env.LOG_DIR;
exports.seeder = {
    adminName: process.env.ADMIN_NAME || 'admin2',
    adminEmail: process.env.ADMIN_EMAIL || 'admin2@admin.com',
    adminPass: process.env.ADMIN_PASS || 'admin21234'
};
