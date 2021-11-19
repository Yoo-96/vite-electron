<template>
  <button @click="handleHide">最小化到托盘</button>
  <button @click="handleShowNotify">5秒钟后提示, 3秒后消失</button>
  <br />
  <br />

  <button @click="toPage('home')">to home page</button>

  <button @click="toPage('user')">to user page</button>
  <br />
  <br />
  <br />
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
// const electron = require('electron');
// const { ipcRenderer } = electron;

let wait = false;

export default defineComponent({
  setup() {
    const router = useRouter();
    const toPage = (name: string) => {
      router.push({
        name,
      });
    };

    const handleHide = () => {
      // ipcRenderer.send('mainWindow:close');
    };

    const handleShowNotify = () => {
      if (wait) {
        alert('等待中，请稍后');
        return;
      }

      wait = true;
      setTimeout(() => {
        wait = false;
        // ipcRenderer.send('mainWindow:notify', '哈哈');
      }, 5000);
    };

    return {
      toPage,
      handleHide,
      handleShowNotify,
    };
  },
});
</script>

<style></style>
