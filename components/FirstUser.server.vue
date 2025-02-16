<script setup lang="ts">
const prisma = usePrismaClient();
const firstUserFound = await prisma.user.findFirst();
</script>

<template>
  <div>
    <p class="text-red-400">user : {{ firstUserFound ?? "" }}</p>
  </div>
</template>
