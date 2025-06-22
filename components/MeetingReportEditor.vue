<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Report } from "~/types/markdownTypes";

const props = defineProps<{
  existingReport?: Report | null;
}>();

const emit = defineEmits(["post-saved"]);

const odjContent = ref("");
const mainContent = ref("");
// The ODJ_SEPARATOR is used to split the content into two parts.
const ODJ_SEPARATOR = "\n\n---ODJ_SEPARATOR---\n\n";

// This watcher will split the incoming content from the DB into the two text areas.
watch(
  () => props.existingReport,
  (newReport) => {
    const fullContent = newReport?.content || "";
    if (fullContent.includes(ODJ_SEPARATOR)) {
      const parts = fullContent.split(ODJ_SEPARATOR);
      odjContent.value = parts[0] || "";
      mainContent.value = parts[1] || "";
    } else {
      // For older reports that don't have the separator, assume all is main content.
      odjContent.value = "";
      mainContent.value = fullContent;
    }
  },
  { immediate: true, deep: true }
);

// This ref prevents the watcher from re-triggering itself in an infinite loop.
const isFormattingOdj = ref(false);

// This watcher automatically prepends '## ' to each non-empty line in the ODJ.
watch(odjContent, (currentValue) => {
  if (isFormattingOdj.value) {
    return;
  }

  const lines = currentValue.split("\n");
  let hasMadeChanges = false;

  const formattedLines = lines.map((line) => {
    if (line.trim().length > 0 && !line.trim().startsWith("### ")) {
      hasMadeChanges = true;
      return "### " + line;
    }
    return line;
  });

  if (hasMadeChanges) {
    isFormattingOdj.value = true;
    odjContent.value = formattedLines.join("\n");
    // nextTick ensures we reset the flag only after the DOM has been updated.
    nextTick(() => {
      isFormattingOdj.value = false;
    });
  }
});

// Gets the current date formatted for French locale.
const getFormattedDate = () => {
  return new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const savePost = async () => {
  const titleForSave =
    props.existingReport?.title || `point front du ${getFormattedDate()}`;

  // Combine the two text areas into a single string before sending.
  const fullContentToSave = `${odjContent.value}${ODJ_SEPARATOR}${mainContent.value}`;

  const reportData = {
    title: titleForSave,
    content: fullContentToSave, // The combined content
    authorId: props.existingReport?.authorId || 1,
  };

  if (props.existingReport?.id) {
    await $fetch(`/api/eventHandler/${props.existingReport.id}`, {
      method: "PUT",
      body: { content: fullContentToSave },
    });
  } else {
    // When creating, we send the whole object.
    await $fetch("/api/eventHandler", {
      method: "POST",
      body: reportData,
    });
  }

  emit("post-saved");
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between p-2">
      <h2 class="text-2xl font-bold text-red-400">Meeting Report Editor</h2>
      <Button @click="savePost" class="m-2">Enregistrer</Button>
    </div>
    <div class="p-2 space-y-4">
      <div>
        <label
          for="report-odj"
          class="block mb-2 text-sm font-medium text-muted-foreground"
          >ODJ (Ordre du Jour)</label
        >
        <Textarea
          id="report-odj"
          v-model="odjContent"
          placeholder="Points à aborder..."
          class="min-h-[100px]"
        />
      </div>
      <div>
        <label
          for="report-content"
          class="block mb-2 text-sm font-medium text-muted-foreground"
          >Contenu du rapport (CR)</label
        >
        <Textarea
          id="report-content"
          v-model="mainContent"
          placeholder="Déroulé de la réunion..."
          class="min-h-[300px]"
        />
      </div>
    </div>
  </div>
</template>
