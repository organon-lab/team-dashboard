<script setup lang="ts">
import { ExternalLink } from "lucide-vue-next";

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

const priorities: Record<string, number> = {
  "severity:critical": 3,
  "severity:major": 2,
  "severity:minor": 1,
};

const sortedIssues = issues.sort((a, b) => {
  const aPriority = a.labels.reduce((acc, label) => {
    if (label.name in priorities) {
      return priorities[label.name];
    }
    return acc;
  }, 0);
  const bPriority = b.labels.reduce((acc, label) => {
    if (label.name in priorities) {
      return priorities[label.name];
    }
    return acc;
  }, 0);
  return bPriority - aPriority;
});
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-1 border border-border bg-card shadow-md overflow-y-auto">
      <table
        class="min-w-full w-full table-fixed text-sm text-left text-foreground"
      >
        <thead class="sticky top-0 z-10 backdrop-blur border-b border-border">
          <tr>
            <th
              class="p-3 font-semibold w-24 text-center border-r border-border"
            >
              Number
            </th>
            <th
              class="p-3 font-semibold w-[320px] max-w-[320px] text-center truncate overflow-hidden whitespace-nowrap border-r border-border"
            >
              Title
            </th>
            <th
              class="p-3 font-semibold w-32 text-center align-middle border-r border-border"
            >
              Severity
            </th>
            <th class="p-3 font-semibold w-32 text-center">Created at</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(issue, idx) in sortedIssues"
            :key="issue.number"
            :class="[
              'transition-colors border-b border-border h-12',
              idx % 2 === 0 ? 'bg-card' : 'bg-muted/40',
              'hover:bg-muted/60',
            ]"
          >
            <td
              class="p-3 font-mono text-xs text-muted-foreground text-center w-24 border-r border-border"
            >
              #{{ issue.number }}
            </td>
            <td
              class="p-3 w-[320px] max-w-[320px] truncate overflow-hidden whitespace-nowrap border-r border-border"
            >
              <a
                :href="issue.html_url"
                target="_blank"
                class="flex items-center hover:underline"
              >
                <span class="mr-1 truncate" :title="issue.title">{{
                  issue.title
                }}</span>
                <ExternalLink :size="16" class="ml-1" color="#57534e" />
              </a>
            </td>
            <td class="p-3 text-center w-32 border-r border-border">
              <span
                class="rounded-full px-2 py-1 font-medium bg-stone-200 dark:bg-stone-800"
                :class="{
                  'text-red-500': issue.labels.some((label) =>
                    label.name.includes('critical')
                  ),
                  'text-orange-500': issue.labels.some((label) =>
                    label.name.includes('major')
                  ),
                  'text-yellow-500': issue.labels.some((label) =>
                    label.name.includes('minor')
                  ),
                  'text-stone-400': !issue.labels.some((label) =>
                    label.name.startsWith('severity:')
                  ),
                }"
              >
                {{
                  issue.labels.filter((label) =>
                    label.name.startsWith("severity:")
                  ).length > 0
                    ? issue.labels
                        .filter((label) =>
                          label.name.startsWith("severity:")
                        )[0]
                        .name.split(":")[1]
                    : "N/A"
                }}
              </span>
            </td>
            <td class="p-3 text-xs text-muted-foreground w-32 text-center">
              {{ issue.created_at.slice(0, 10) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
