<script setup lang="ts">
import { Octokit } from "octokit";
import {
  Sun,
  CloudSunRain,
  CloudLightning,
  TriangleAlert,
  CircleAlert,
  OctagonAlert,
  CircleHelp,
} from "lucide-vue-next";

const { issues } = defineProps({
  issues: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="flex flex-col items-center p-4">
    <h1 class="text-2xl font-bold text-center">WEATHER</h1>
    <component
      :is="
        (issues.length < 20 && Sun) ||
        (issues.length < 50 && CloudSunRain) ||
        CloudLightning
      "
      :size="64"
      :color="
        (issues.length < 20 && '#f6e05e') ||
        (issues.length < 50 && '#f6ad55') ||
        '#f56565'
      "
    />
    <p class="text-center">
      There are currently {{ issues.length }} frontend bugs in the OSRD
      repository.
    </p>
    <div
      class="flex justify-between text-stone-200 bg-stone-700 rounded-full px-4 py-2 mt-2"
    >
      <p class="flex mr-4 items-center">
        <component
          :is="TriangleAlert"
          :size="16"
          color="#f56565"
          class="mr-2"
        />
        critical:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("critical")),
          ).length
        }}
      </p>
      <p class="flex mr-4 items-center">
        <component :is="OctagonAlert" :size="16" color="#f6ad55" class="mr-2" />
        major:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("major")),
          ).length
        }}
      </p>
      <p class="flex mr-4 items-center">
        <component :is="CircleAlert" :size="16" color="#f6e05e" class="mr-2" />
        minor:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("minor")),
          ).length
        }}
      </p>
      <p class="flex items-center">
        <component :is="CircleHelp" :size="16" color="gray" class="mr-2" />
        untagged:
        {{
          issues.filter(
            (issue) =>
              !issue.labels.some((label) => label.name.startsWith("severity:")),
          ).length
        }}
      </p>
    </div>
  </div>
</template>
