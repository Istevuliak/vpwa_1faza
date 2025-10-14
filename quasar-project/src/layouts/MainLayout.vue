<template>
  <q-layout view="lHh Rpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>

        <!-- alebo este CLIck je pekny nazov na command line -->
        <q-toolbar-title class="text-left">
          Shello
        </q-toolbar-title>

        <!-- Ikony vpravo -->
        <div v-if="isChatPage" class="row items-center q-gutter-sm">
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
          <q-btn color="dark" flat>
            <q-icon class="material-symbols-outlined q-mr-xs">logout</q-icon>
            Log out

            <!-- menu as slot -->
            <q-menu v-model="showLogoutMenu" anchor="bottom right" self="top right" :offset="[0, 16]">
              <q-card style="min-width: 200px;">
                <q-card-section class="text-center">
                  Do you want to log out?
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancel" v-close-popup @click="showLogoutMenu = false" />
                  <q-btn color="primary" label="Log out" @click="confirmLogout" />
                </q-card-actions>
              </q-card>
            </q-menu>
          </q-btn>

        </div>
      </q-toolbar>
    </q-header>

    <!-- PRAVÉ MENU (Drawer) -->
    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
// zistenie kde sa nachadzame
import { useRoute } from 'vue-router';
const route = useRoute();
const isChatPage = computed(() => route.path === '/chat'); 

const router = useRouter();

const linksList: EssentialLinkProps[] = [
  { title: 'Profile', caption: 'User details', icon: 'person', link: '#' },
  { title: 'Settings', caption: 'Account preferences', icon: 'settings', link: '#' },
  { title: 'Help', caption: 'Get support', icon: 'help', link: '#' },
];

const rightDrawerOpen = ref(false);

// logout overlay
const showLogoutMenu = ref(false);

async function confirmLogout() {
  showLogoutMenu.value = false;
  await router.push('/login');
}


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
.q-toolbar {
  color: #000; /* Čierny text pre lepší kontrast */
}

</style>
