<template>
  <!-- ✅ Add Friend Dialog -->
  <q-dialog v-model="addFriendDialog" persistent>
    <q-card style="min-width: 300px;">
      <q-card-section><div class="text-h6">Add new friend</div></q-card-section>
      <q-card-section>
        <q-input
          v-model="newFriendName"
          label="Friend name"
          outlined
          dense
          autofocus
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" v-close-popup />
        <q-btn flat label="Add" color="primary" @click="emitAddFriend" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Invitation Dialog -->
  <q-dialog v-model="invitationsDialog">
    <q-card style="min-width: 350px;">
      <q-card-section>
        <div class="text-h6">Invitations</div>
      </q-card-section>

      <q-list bordered separator>
        <q-item v-for="invite in invitations" :key="invite.id">
          <q-item-section>
            {{ invite.from }} invited you to {{ invite.channel }}
          </q-item-section>
          <q-item-section side>
            <q-btn
              dense
              flat
              color="primary"
              label="Accept"
              @click="emit('acceptInvite', invite.id)"
            />
            <q-btn
              dense
              flat
              color="negative"
              label="Decline"
              @click="emit('declineInvite', invite.id)"
            />
          </q-item-section>
        </q-item>

        <q-item v-if="!invitations.length">
          <q-item-section>No invitations yet</q-item-section>
        </q-item>
      </q-list>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="secondary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Invitation } from '../types/types'

// 🔹 Props z rodiča
const props = defineProps<{
  invitations: Invitation[]
  addFriendDialog: boolean
  invitationsDialog: boolean
}>()

// 🔹 Udalosti (emity)
const emit = defineEmits(['addFriend', 'acceptInvite', 'declineInvite'])

// 🔹 Lokálny stav pre input
const newFriendName = ref('')

// 🔹 Funkcia na pridanie priateľa
function emitAddFriend() {
  const name = newFriendName.value.trim()
  if (name !== '') {
    emit('addFriend', name)
    newFriendName.value = ''
  }
}

// 🔹 Lokálne referencie (len pre prehľadnosť v template)
const invitations = props.invitations
const addFriendDialog = props.addFriendDialog
const invitationsDialog = props.invitationsDialog
</script>
