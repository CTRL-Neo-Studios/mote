<template>
  <UApp>
      <NuxtLayout>
          <NuxtPage />
      </NuxtLayout>
  </UApp>
</template>
<script setup lang="ts">
import {useDirs} from "~/composables/utility/useDirs";

onMounted(async () => {
    await useDirs().initDirs()
})
</script>