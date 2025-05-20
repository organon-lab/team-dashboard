<script setup lang="ts">
const prisma = usePrismaClient();

const tasks = await prisma.task.findMany({
  include: {
    user: true,
  },
});
</script>

<template>
  <div>
    <h1
      class="text-2xl font-bold text-center text-red-400"
    >Tasks</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">
	<span class="text-green-400">User: {{ task.user?.name }}</span>
	&nbsp;
        <span class="text-green-400">Task: {{ task.title }}</span>
      </li>
    </ul>
  </div>
</template>
