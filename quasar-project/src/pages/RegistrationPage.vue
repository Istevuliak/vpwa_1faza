<template>
  <q-page class="flex flex-center bg-secondary">
    <q-card style="width: 400px;" flat bordered>
      <q-form
        @submit="register"
        class="q-pa-md q-gutter-y-md"
        style="width: 400px;"
      >
        <q-input v-model="firstName" label="Name" outlined required dense />
        <q-input v-model="lastName" label="Surname" outlined required dense />
        <q-input v-model="nickName" label="NickName" outlined required dense />
        <q-input v-model="email" label="Email" type="email" outlined required dense />

        <q-input
          v-model="password"
          label="Password"
          type="password"
          outlined
          required
          dense
        />

        <q-input
          v-model="passwordCheck"
          label="Check password"
          type="password"
          outlined
          required
          dense
          :error="passwordCheckError"
          error-message="Passwords do not match"
        />

        <q-btn
          label="Register"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const firstName = ref('');
const lastName = ref('');
const nickName = ref('');
const email = ref('');
const password = ref('');
const passwordCheck = ref('');

const router = useRouter();

//ak hesla nie su rovnake, zobrazime error message
const passwordCheckError = computed(() => {
  return passwordCheck.value !== '' && passwordCheck.value !== password.value;
});

const register = async () => {
  //ak nie su rovnake, zobrazime alert
  if (passwordCheckError.value) {
    alert('Passwords do not match!');
    return;
  }

  console.log({
    firstName: firstName.value,
    lastName: lastName.value,
    nickName: nickName.value,
    email: email.value,
    password: password.value,
    passwordCheck: passwordCheck.value
  });

  alert('Registration successful!');
  await router.push('/login');
};
</script>
