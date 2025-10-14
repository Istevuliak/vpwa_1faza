<template>
  <div class="column bg-grey-2" style="position: sticky; bottom: 0; border-top: 1px solid #444;">
    <div ref="historyBox" class="message-history" style="max-height:150px; overflow-y:auto; padding:6px 12px; font-family:monospace; font-size:14px; color:#222;">
      <div v-for="(msg, index) in messages" :key="index">{{ msg }}</div>
    </div>

    <q-input
      ref="cliInput"
      v-model="newMessage"
      type="textarea"
      borderless
      autogrow
      input-class="command-input"
      input-style="padding-left:12px;"
      :placeholder="showPlaceholder ? 'Enter a message' : ''"
      @focus="showPlaceholder = false"
      @blur="showPlaceholder = true"
      @keyup.enter.exact.prevent="sendMessage"
      @keyup.enter.shift.stop
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { Channel, Friend } from '../types/types';

const props = defineProps<{
  activeFriend: Friend | null;
  activeChannel: Channel | null;
}>();

//CLI fixne
const messages = ref<string[]>([]);
const newMessage = ref("");
const showPlaceholder = ref(true);
const historyBox = ref<HTMLElement | null>(null);

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text) return;

  if (text.startsWith("/")) {
    messages.value.push(text);
  } else if (props.activeFriend || props.activeChannel) {
    const target = props.activeFriend ?? props.activeChannel;
    target?.messages?.push({ id: Date.now(), user: "You", text });
  } else {
    messages.value.push(text);
  }

  newMessage.value = "";
  void nextTick(() => {
    if (text.startsWith("/") && historyBox.value) historyBox.value.scrollTop = historyBox.value.scrollHeight;
  });
}
</script>

<style scoped>
.command-input { font-family: monospace; max-height:150px; overflow-y:auto; }
</style>
