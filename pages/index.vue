<script setup lang="ts">
import { Sun, Moon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NuxtIsland } from "#components";
const colorMode = useColorMode();
</script>

<template>
  <div class="h-screen overflow-y-hidden p-2">
    <div class="grid grid-cols-12 min-h-1/6">
      <h1 class="text-2xl font-bold col-span-4">OSRD frontend dashboard</h1>
      <div class="col-span-4">
        <NuxtIsland name="Weather" />
      </div>
      <div class="col-span-4 flex justify-end">
        <Button
          @click="
            colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
          "
          class="m-2"
        >
          <component :is="colorMode.value === 'light' ? Sun : Moon" />
        </Button>
      </div>
    </div>
    <Separator />
    <div class="grid grid-cols-12 h-5/6">
      <div class="col-span-6 overflow-y-auto">
        <NuxtIsland name="Issues"> </NuxtIsland>
      </div>
      <Separator orientation="vertical" />
      <div class="col-span-6"></div>
    </div>
  </div>
</template>
