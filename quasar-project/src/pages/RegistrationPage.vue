<template>
  <q-page class="flex flex-center">
    <q-form @submit="register" class="q-pa-md" style="width: 400px;">
      <q-input v-model="firstName" label="Meno" outlined required />
      <q-input v-model="lastName" label="Priezvisko" outlined required />
      <q-input v-model="nickName" label="NickName" outlined required />
      <q-input v-model="email" label="Email" type="email" outlined required />
      <q-input v-model="password" label="Heslo" type="password" outlined required />
      <q-btn label="Registrovať" type="submit" color="primary" class="full-width q-mt-md"/>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firstName = ref('');
const lastName = ref('');
const nickName = ref('');
const email = ref('');
const password = ref('');

const router = useRouter();

const register = () => {
  // Tu by si normálne volala API na registráciu
  console.log({ firstName: firstName.value, lastName: lastName.value, nickName: nickName.value, email: email.value, password: password.value });
  alert('Registrácia úspešná!');
  router.push('/login');
};
</script>
