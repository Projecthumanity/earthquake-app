module.exports = function override(config, env) {
  if (env === 'development') {
    config.devServer = {
      ...config.devServer,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy': `
          default-src 'self' https://*.openstreetmap.org https://*.tile.openstreetmap.org https://earthquake.usgs.gov; 
          img-src 'self' https://*.openstreetmap.org https://*.tile.openstreetmap.org data: blob:;
          style-src 'self' 'unsafe-inline';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          connect-src 'self' https://earthquake.usgs.gov;
        `
      }
    };
  }
  return config;
};