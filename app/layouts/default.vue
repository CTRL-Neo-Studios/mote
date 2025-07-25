<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();
</script>

<template>
<!--    <div class="absolute top-0 right-0 left-0 flex items-center p-2 w-full h-fit" data-tauri-drag-region>-->
<!--        <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="() => {appWindow.close()}"/>-->
<!--        <div class="flex-grow"/>-->
<!--    </div>-->
    <slot/>
</template>

<style scoped>

</style>