import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from "@auth0/auth0-vue";
import * as process from 'process';

import App from './App.vue'
import router from './router'

import './assets/main.css'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

const cache = new InMemoryCache()

const variables = process?.env as {[key: string]: string}

const uri = variables && variables["VUE_APP_API_SERVER_URL"] ? `${process.env.VUE_APP_API_SERVER_URL}/graphql/` : 'http://localhost:8000/graphql/'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri,
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const app = createApp({
    setup () {
      provide(DefaultApolloClient, apolloClient)
    },
  
    render: () => h(App),
  })
app.use(createPinia())
app
  .use(router)
  .use(
    createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        // audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
      },
    })
  )

app.mount('#app')
