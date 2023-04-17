<template>
  <div class="page-layout">
    <button class="button__login" @click="handleLogin">Log In</button>
    <div class="page-layout__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";
const { error, loginWithRedirect } = useAuth0();

const handleLogin = () => {
  loginWithRedirect({
    appState: {
      target: "/",
    },
    authorizationParams: {
      screen_hint: "signup",
    },
  });
};
</script>
