<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Number</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Severity</TableHead>
        <TableHead>Created at</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="issue in sortedIssues" :key="issue.number">
        <TableCell>#{{ issue.number }}</TableCell>
        <TableCell>
          <a :href="issue.html_url" target="_blank" class="flex items-center">
            <span class="mr-1" :title="issue.title">{{ issue.title }}</span>
            <div class="w-4 h-4">
              <ExternalLink :size="16" class="mr-1" color="#57534e" />
            </div>
          </a>
        </TableCell>
        <TableCell class="text-center">
          <p
            :class="{
              'text-red-500':
                issue.labels.filter((label) => {
                  if (typeof label !== 'string' && label.name) {
                    return label.name.includes('critical');
                  }
                }).length > 0,
              'text-orange-500':
                issue.labels.filter((label) => {
                  if (typeof label !== 'string' && label.name) {
                    return label.name.includes('major');
                  }
                }).length > 0,
              'text-yellow-500':
                issue.labels.filter((label) => {
                  if (typeof label !== 'string' && label.name) {
                    return label.name.includes('minor');
                  }
                }).length > 0,
              'text-stone-400':
                issue.labels.filter((label) => {
                  if (typeof label !== 'string' && label.name) {
                    return label.name.includes('severity:');
                  }
                }).length === 0,
            }"
            class="bg-stone-800 rounded-full px-2 py-1"
          >
            {{
              issue.labels.filter((label) => label.name.startsWith("severity:"))
                .length > 0
                ? issue.labels
                    .filter((label) => label.name.startsWith("severity:"))[0]
                    .name.split(":")[1]
                : "N/A"
            }}
          </p>
        </TableCell>
        <TableCell class="truncate">{{
          issue.created_at.slice(0, 10)
        }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
