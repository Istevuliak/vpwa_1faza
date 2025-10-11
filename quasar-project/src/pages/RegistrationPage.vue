<template>
  <q-page class="flex flex-center bg-secondary">
    <q-card style="width: 400px;" flat bordered>
      <q-form
        @submit="register"
        class="q-pa-md q-gutter-y-md"
        style="width: 400px;"
      >
        <div class="block text-h6 q-mb-lg text-center"></div>
        <div class="profile-wrapper column items-center q-mb-md">
          <ProfilePicture
            :avatar="uploadedAvatar"
            size="80px"
            bgColor="grey-4"
          />

          <q-btn
            flat
            color="primary"
            class="q-mt-xs text-caption"
            label="add profile picture"
            @click="triggerFileInput"
          />

          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileUpload"
          />
        </div>

        <q-input v-model="firstName" label="Name*" outlined required dense maxlength="20" />
        <q-input v-model="lastName" label="Surname*" outlined required dense maxlength="30"/>
        <q-input v-model="nickName" label="NickName*" outlined required dense maxlength="20"/>
        <q-input v-model="email" label="Email*" type="email" outlined required dense maxlength="30"/>

        <q-input
          v-model="password"
          label="Password"
          :type="isPwdVisible1 ? 'password' : 'text'"
          outlined
          required
          dense
          :rules="[
              value => (value && value.length >= 8 && /\d/.test(value)) || 'Enter at least 8 characters, with at least one number'
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwdVisible1 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdVisible1 = !isPwdVisible1"
            />
          </template>
        </q-input>

        <q-input
          v-model="passwordCheck"
          label="Check password"
          :type="isPwdVisible2 ? 'password' : 'text'"
          outlined
          required
          dense
          :error="passwordCheckError"
          error-message="Passwords do not match"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwdVisible2 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdVisible2 = !isPwdVisible2"
            />
          </template>
        </q-input>

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
const isPwdVisible1 = ref(true);
const isPwdVisible2 = ref(true);

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

// Profile picture
import ProfilePicture from '../components/ProfilePicture.vue';

const uploadedAvatar = ref<string | undefined>(undefined);
const fileInput = ref<HTMLInputElement>();

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedAvatar.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped>
  .profile-wrapper {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .block {
    height: 40px;
  }
</style>