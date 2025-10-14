<template>
  <q-page class="flex flex-center bg-secondary">
    <q-card style="width: 400px;" flat bordered>
      <q-card-section class="q-pa-lg">
        <div class="text-h6 q-mb-lg">Log in</div>

        <q-form @submit="login" class="q-gutter-y-md">
          <q-input
            v-model="email"
            label="Email*"
            type="email"
            outlined
            required
            dense
            maxlength="30"
          >
            <template v-slot:prepend>
              <q-icon class="material-symbols-outlined">email</q-icon>
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="isPwdVisible ? 'password' : 'text'"
            label="Password*"
            outlined
            required
            dense
            :rules="[
              value => (value && value.length >= 8 && /\d/.test(value)) || 'Enter at least 8 characters, with at least one number'
            ]"
          >
            <template v-slot:prepend>
              <q-icon class="material-symbols-outlined">lock</q-icon>
            </template>

            <template v-slot:append>
              <q-icon
                :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdVisible = !isPwdVisible"
              />
            </template>
          </q-input>
          <div>
            <span class="forgot-link" @click="onForgotPassword">Forgot password?</span>
          </div>

          <q-btn
            type="submit"
            label="Log in"
            color="primary"
            class="full-width"
          />
        </q-form>

        <div class="q-mt-md text-center">
          <span>Don't have account yet? </span>
          <q-btn flat color="primary" @click="goToRegister">Sign up</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts" >
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const password = ref('');
const email = ref('');
const isPwdVisible = ref(true);

const router = useRouter();

const login = () => {
  // tu sa vola API potom
  void router.push('/chat'); // presmerovanie po prihlaseni, toto este nemame, treba spravit ChatPAge.vue
};

const goToRegister = () => {
  void router.push('/register'); // presmerovanie na registrovanie pagu
};

const onForgotPassword = () => {
  console.log('Forgot password clicked — page not implemented yet');
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

.forgot-link {
  color: var(--q-primary); /* používa primary farbu z Quasar témy */
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}
.forgot-link:hover {
  opacity: 0.8;
}
</style>