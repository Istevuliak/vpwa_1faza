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
          <div class="relative-position">
            <q-btn
              flat
              dense
              round
              aria-label="User"
              @click="toggleRightDrawer"
            >
              <q-icon class="material-symbols-outlined">account_circle</q-icon>
            </q-btn>
            <q-badge color="red" floating transparent>{{ notifications.length }}</q-badge>
          </div>

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

        <!-- Položky z linksList ako q-item -->
        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          :to="link.link || undefined"
          @click="handleLinkClick(link)"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" class="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Dropdown menu pre Profile (pridáme ho dynamicky cez slot alebo podmienku) -->
        <q-menu v-if="profileMenuVisible" anchor="bottom left" self="top left">
          <q-list style="min-width: 150px;">
            <q-item clickable v-close-popup @click="showProfilePictureDialog = true">
              <q-item-section>Set profile picture</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="showStatusDialog = true">
              <q-item-section>Statuses</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="showChangePasswordDialog = true">
              <q-item-section>Change password</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-toggle
                  v-model="notifyOnlyWhenTagged"
                  label="Notify only when tagged"
                  @update:model-value="handleNotifyToggle"
                >
                  <q-tooltip>Receive notifications only when mentioned or tagged</q-tooltip>
                </q-toggle>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>

        <q-item v-if="notifications.length > 0">
          <q-item-section>
            <div class="notification-message">
              {{ notifications[0]?.message }}
              <q-btn
                flat
                dense
                round
                icon="close"
                size="sm"
                @click="dismissNotification"
                class="q-ml-sm"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Dialóg pre nastavenie profilového obrázka -->
    <q-dialog v-model="showProfilePictureDialog">
      <q-card style="min-width: 300px;">
        <q-card-section>
          <div class="text-h6">Set Profile Picture</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newProfilePicture"
            label="Profile picture URL"
            outlined
            dense
            autofocus
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveProfilePicture" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialóg pre nastavenie stavu -->
    <q-dialog v-model="showStatusDialog">
      <q-card style="min-width: 300px;">
        <q-card-section>
          <div class="text-h6">Set your status</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="userStatus"
            :options="statusOptions"
            option-value="value"
            option-label="label"
            label="Status"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveUserStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialóg pre zmenu hesla -->
    <q-dialog v-model="showChangePasswordDialog">
      <q-card style="min-width: 300px;">
        <q-card-section>
          <div class="text-h6">Change Password</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="oldPassword"
            label="Old password"
            type="password"
            outlined
            dense
            class="q-mb-md"
          />
          <q-input
            v-model="newPassword"
            label="New password"
            type="password"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="changePassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- OBSAH -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface MenuLink {
  title: string;
  caption?: string;
  icon?: string;
  link?: string | undefined;
}

// zistenie kde sa nachadzame
import { useRoute } from 'vue-router';
const route = useRoute();
const isChatPage = computed(() => route.path === '/chat'); 

const router = useRouter();

// Definícia rozhrania pre notifikácie
interface Notification {
  message: string;
}

// Definícia notifikácií
const notifications = ref<Notification[]>([
  { message: 'Tento channel bol neaktívny 30 dní, rušíme ho' },
]);

// Možnosti stavu
type UserStatus = 'online' | 'dnd' | 'offline';
const statusOptions = [
  { label: 'Online', value: 'online' as const },
  { label: 'Do Not Disturb', value: 'dnd' as const },
  { label: 'Offline', value: 'offline' as const },
];

// Aktuálny stav používateľa
const userStatus = ref<UserStatus>('online');

// Premenné pre dialógy
const showProfilePictureDialog = ref(false);
const showStatusDialog = ref(false);
const showChangePasswordDialog = ref(false);
const newProfilePicture = ref('');
const oldPassword = ref('');
const newPassword = ref('');

// Premenná pre viditeľnosť dropdown menu pre Profile
const profileMenuVisible = ref(false);

const linksList: MenuLink[] = [
  { 
    title: 'Profile', 
    caption: 'User details', 
    icon: 'person',
    link: undefined 
  },
  { title: 'Settings', caption: 'Account preferences', icon: 'settings', link: '#' },
  { title: 'Help', caption: 'Get support', icon: 'help', link: '#' },
];

const rightDrawerOpen = ref(false);
const showLogoutMenu = ref(false);

// Funkcia na spracovanie kliknutia na link
function handleLinkClick(link: MenuLink) {
  if (link.title === 'Profile') {
    profileMenuVisible.value = true;
  } 
  // else {
  //   // Pre ostatné linky normálna navigácia
  //   if (link.link) {
  //     router.push(link.link);
  //   }
  // }
}

// Funkcia na zatvorenie notifikácie
function dismissNotification() {
  notifications.value.shift(); // Odstráni prvú notifikáciu
}

// Funkcia na uloženie profilového obrázka
function saveProfilePicture() {
  if (newProfilePicture.value.trim()) {
    // Tu by sa uložil obrázok na server, momentálne len zatvoríme dialóg
    console.log('Saving profile picture:', newProfilePicture.value);
    newProfilePicture.value = '';
    showProfilePictureDialog.value = false;
  }
}

// Funkcia na uloženie stavu
function saveUserStatus() {
  // Tu by sa stav uložil na server, momentálne len zatvoríme dialóg
  console.log('Saving user status:', userStatus.value);
  showStatusDialog.value = false;
}

// Funkcia na zmenu hesla
function changePassword() {
  if (oldPassword.value && newPassword.value) {
    // Tu by sa zavolalo API na zmenu hesla, momentálne len zatvoríme dialóg
    console.log('Changing password from', oldPassword.value, 'to', newPassword.value);
    oldPassword.value = '';
    newPassword.value = '';
    showChangePasswordDialog.value = false;
  }
}

async function confirmLogout() {
  showLogoutMenu.value = false;
  await router.push('/login');
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
const notifyOnlyWhenTagged = ref(false);

function handleNotifyToggle(value: boolean) {
  console.log('Notify only when tagged:', value);
  // nejaky backend uz
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

.notification-message {
  background-color: #F44336; /* Červené pozadie */
  color: #000; /* Čierny text */
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>