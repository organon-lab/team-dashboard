<script setup lang="ts">
import { ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Report } from "~/types/markdownTypes";

const props = defineProps<{
  existingReport?: Report | null;
}>();

const emit = defineEmits(["post-saved"]);

const reportContent = ref("");

// This watcher now only cares about the content.
watch(
  () => props.existingReport,
  (newReport) => {
    reportContent.value = newReport?.content || "";
  },
  { immediate: true, deep: true }
);

// Gets the current date formatted for French locale.
const getFormattedDate = () => {
  return new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const savePost = async () => {
  // Determine the title at the moment of saving.
  const titleForSave =
    props.existingReport?.title || `point front du ${getFormattedDate()}`;

  const reportData = {
    title: titleForSave,
    content: reportContent.value,
    authorId: props.existingReport?.authorId || 1,
  };

  if (props.existingReport?.id) {
    // Update an existing report (content only).
    await $fetch(`/api/eventHandler/${props.existingReport.id}`, {
      method: "PUT",
      body: { content: reportContent.value }, // Send only what changed
    });
  } else {
    // Create a new report.
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
    <div class="p-2">
      <label
        for="report-content"
        class="block mb-2 text-sm font-medium text-muted-foreground"
        >Contenu</label
      >
      <Textarea
        id="report-content"
        v-model="reportContent"
        placeholder="Contenu du rapport en Markdown..."
        class="min-h-[300px]"
      />
    </div>
  </div>
</template>
