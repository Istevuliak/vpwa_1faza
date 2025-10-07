<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px;" flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Log in</div>
        <q-form @submit="login" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            required
            dense
          >
            <template v-slot:prepend>
              <q-icon class="material-symbols-outlined">email</q-icon>
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            required
            dense
          >
            <template v-slot:prepend>
              <q-icon class="material-symbols-outlined">lock</q-icon>
            </template>
          </q-input>

          <q-btn type="submit" label="Log in" color="primary" class="full-width" />
        </q-form>

        <div class="q-mt-md text-center">
          <span>Dont have account yet? </span>
          <q-btn flat color="secondary" @click="goToRegister">Sign un</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');

const router = useRouter();

const login = () => {
  // tu sa vola API potom
  alert(`Logged in user: ${email.value}`);
  void router.push('/chat'); // presmerovanie po prihlaseni, toto este nemame, treba spravit ChatPAge.vue
};

const goToRegister = () => {
  void router.push('/register'); // presmerovanie na registrovanie pagu
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>
