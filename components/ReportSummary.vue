<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { ParsedMarkdownType, Report } from "~/types/markdownTypes";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const props = defineProps<{
  report: Report;
}>();

const ODJ_SEPARATOR = "\n\n---ODJ_SEPARATOR---\n\n";

/**
 * Extracts only the ODJ part from the full content string.
 */
const odjText = computed(() => {
  const fullContent = props.report.content || "";
  if (fullContent.includes(ODJ_SEPARATOR)) {
    return fullContent.split(ODJ_SEPARATOR)[0];
  }
  return "";
});

const parsedOdj = ref<ParsedMarkdownType | null>(null);

// This watcher parses the ODJ text when it changes.
watch(
  odjText,
  async (newText) => {
    if (newText && newText.trim()) {
      try {
        parsedOdj.value = await parseMarkdown(newText);
      } catch (error) {
        console.error("Error parsing ODJ markdown:", error);
        parsedOdj.value = null;
      }
    } else {
      parsedOdj.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-6 pt-0">
    <div class="border-t pt-4">
      <div v-if="parsedOdj && parsedOdj.body" class="markdown">
        <h2>Voici l'ODJ :</h2>
        <MDCRenderer :body="parsedOdj.body" :data="parsedOdj.data" />
      </div>
      <p v-else class="text-sm text-muted-foreground italic">
        Aucun ordre du jour défini pour ce rapport.
      </p>
    </div>
  </div>
</template>
