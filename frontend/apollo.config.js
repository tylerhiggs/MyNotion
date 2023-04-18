// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'my-app',
        // URL to the GraphQL API
        url: process.env["VUE_APP_API_SERVER_URL"] ? `${process.env.VUE_APP_API_SERVER_URL}/graphql/` : 'https://appolo-config/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }