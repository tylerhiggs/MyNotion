<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";

const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
const onLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
};
const login = () => {
  loginWithRedirect({
    appState: {
      target: "/",
    },
  });
};
const signup = () => {
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

<template>
  <div class="z-10 rounded-md bg-white p-2">
    <button v-if="isAuthenticated" @click="onLogout">Log Out</button>
    <button v-else @click="login">Log In</button>
    <button @click="signup">Sign Up</button>
  </div>
</template>
