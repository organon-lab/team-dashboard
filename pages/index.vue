<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import Calendar from "~/components/ui/calendar/Calendar.vue";
import { Sun, Moon } from "lucide-vue-next";

const route = useRoute();
const colorMode = useColorMode();

const counter = useState<number>("counter", () => 0);
</script>

<template>
  <div class="mb-5">
    <p>Current route: {{ route.path }}</p>
    <NuxtIsland name="FirstUser"> </NuxtIsland>
    <Button @click="counter++" class="mr-1">
      {{ counter }}
    </Button>
  </div>
  <div class="flex justify-evenly items-center">
    <Calendar mode="single" class="rounded-md border" />
    <Button
      @click="colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'"
    >
      <component :is="colorMode.value === 'light' ? Sun : Moon" />
    </Button>
  </div>
  <NuxtIsland name="Issues"> </NuxtIsland>
</template>
