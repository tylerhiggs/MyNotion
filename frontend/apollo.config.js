// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'my-app',
        // URL to the GraphQL API
        url: process.env["VITE_API_SERVER_URL"] ? `${process.env.VITE_API_SERVER_URL}/graphql/` : 'http://localhost:8000/graphql/',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }