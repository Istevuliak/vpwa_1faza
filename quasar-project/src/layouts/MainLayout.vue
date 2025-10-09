<template>
  <q-layout view="lHh Rpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>

        <!-- alebo este CLIck je pekny nazov na command line -->
        <q-toolbar-title class="text-center">
          Shello
        </q-toolbar-title>

        <!-- Ikony vpravo -->
        <div class="row items-center q-gutter-sm">
          <!-- Ikona používateľa (otvára pravé menu) -->
          <q-btn
            flat
            dense
            round
            aria-label="User"
            @click="toggleRightDrawer"
          >
            <q-icon class="material-symbols-outlined">account_circle</q-icon>
          </q-btn>

          <!-- Log out -->
          <q-btn color="dark" flat @click="logout">
            <q-icon class="material-symbols-outlined q-mr-xs">logout</q-icon>
            Log out
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- PRAVÉ MENU (Drawer) -->
    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          User Menu
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- OBSAH -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const router = useRouter();

const linksList: EssentialLinkProps[] = [
  { title: 'Profile', caption: 'User details', icon: 'person', link: '#' },
  { title: 'Settings', caption: 'Account preferences', icon: 'settings', link: '#' },
  { title: 'Help', caption: 'Get support', icon: 'help', link: '#' },
];

const rightDrawerOpen = ref(false);

const logout = async () => {
  alert('Log out successful!');
  await router.push('/login');
};

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>

<style scoped>
.text-center {
  flex: 1;
  text-align: center;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>
