<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  CloudSunRain,
  CloudLightning,
  TriangleAlert,
  CircleAlert,
  OctagonAlert,
  CircleHelp,
  User,
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
    <component
      :is="
        issues.some((issue) =>
          issue.labels.some((label) => label.name.includes('critical')),
        )
          ? CloudLightning
          : issues.some((issue) =>
                issue.labels.some((label) => label.name.includes('major')),
              )
            ? CloudSunRain
            : issues.some((issue) =>
                  issue.labels.some((label) => label.name.includes('minor')),
                )
              ? Sun
              : Sun
      "
      :size="64"
      :color="
        issues.some((issue) =>
          issue.labels.some((label) => label.name.includes('critical')),
        )
          ? '#f56565'
          : issues.some((issue) =>
                issue.labels.some((label) => label.name.includes('major')),
              )
            ? '#f6ad55'
            : issues.some((issue) =>
                  issue.labels.some((label) => label.name.includes('minor')),
                )
              ? '#f6e00e'
              : '#f6e00e'
      "
    />
    <p class="text-center text-sm font-light my-2">
      Il y a actuellement {{ issues.length }} bugs front dans le dépôt OSRD.
    </p>
    <div class="flex items-center space-x-1 rounded-full bg-secondary p-1 mt-2">
      <Badge
        class="h-7 border-transparent !bg-red-700 px-3 text-sm text-white select-none"
      >
        <TriangleAlert :size="14" class="mr-1.5" />
        critical:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("critical")),
          ).length
        }}
      </Badge>
      <Badge
        class="h-7 border-transparent !bg-orange-600 px-3 text-sm text-white select-none"
      >
        <OctagonAlert :size="14" class="mr-1.5" />
        major:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("major")),
          ).length
        }}
      </Badge>
      <Badge
        class="h-7 border-transparent !bg-yellow-500 px-3 text-sm text-gray-900 select-none"
      >
        <CircleAlert :size="14" class="mr-1.5" />
        minor:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("minor")),
          ).length
        }}
      </Badge>
      <Badge class="!bg-gray-600 h-7 px-3 text-sm text-white select-none">
        <CircleHelp :size="14" class="mr-1.5" />
        untagged:
        {{
          issues.filter(
            (issue) =>
              !issue.labels.some((label) => label.name.startsWith("severity:")),
          ).length
        }}
      </Badge>
      <Badge
        class="h-7 border-transparent !bg-green-600 px-3 text-sm text-white select-none"
      >
        <User :size="14" class="mr-1.5" />
        users:
        {{
          issues.filter((issue) =>
            issue.labels.some((label) => label.name.includes("from:users")),
          ).length
        }}
      </Badge>
    </div>
  </div>
</template>
