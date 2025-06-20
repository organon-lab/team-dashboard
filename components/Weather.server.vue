<script setup lang="ts">
import { Octokit } from "octokit";
import { Badge } from "@/components/ui/badge";
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
    type: Array<{
      number: number;
      title: string;
      labels: Array<{ name: string }>;
      created_at: string;
      html_url: string;
    }>,
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
        (issues.length < 20 && '#f6e00e') ||
        (issues.length < 50 && '#f6ad55') ||
        '#f56565'
      "
    />
    <p class="text-center">
      There are currently {{ issues.length }} frontend bugs in the OSRD
      repository.
    </p>
    <div class="flex items-center space-x-1 rounded-full bg-secondary p-1 mt-2">
      <Badge
        class="h-7 border-transparent bg-red-700/80 px-3 text-sm text-white hover:bg-red-700"
      >
        <TriangleAlert :size="14" class="mr-1.5" />
        critical:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("critical"))
          ).length
        }}
      </Badge>
      <Badge
        class="h-7 border-transparent bg-orange-600/80 px-3 text-sm text-white hover:bg-orange-600"
      >
        <OctagonAlert :size="14" class="mr-1.5" />
        major:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("major"))
          ).length
        }}
      </Badge>
      <Badge
        class="h-7 border-transparent bg-yellow-500/80 px-3 text-sm text-gray-900 hover:bg-yellow-500"
      >
        <CircleAlert :size="14" class="mr-1.5" />
        minor:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("minor"))
          ).length
        }}
      </Badge>
      <Badge variant="outline" class="h-7 px-3 text-sm">
        <CircleHelp :size="14" class="mr-1.5" />
        untagged:
        {{
          issues.filter(
            (issue) =>
              !issue.labels.some((label) => label.name.startsWith("severity:"))
          ).length
        }}
      </Badge>
    </div>
  </div>
</template>
