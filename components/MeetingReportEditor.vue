<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Report } from "~/types/markdownTypes";

const props = defineProps<{
  existingReport?: Report | null;
}>();

const emit = defineEmits(["post-saved"]);

const reportTitle = ref("");
const reportContent = ref("");

// Gets the current date formatted for French locale.
const getFormattedDate = () => {
  return new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

watch(
  () => props.existingReport,
  (newReport) => {
    // If we are editing an existing report.
    if (newReport && newReport.id) {
      reportTitle.value = newReport.title || "";
      reportContent.value = newReport.content || "";
    } else {
      // Otherwise, it's a new report. Set the default title.
      reportTitle.value = `Point front du ${getFormattedDate()}`;
      reportContent.value = "";
    }
  },
  { immediate: true, deep: true }
);

const savePost = async () => {
  // Simple validation to ensure the title is not empty.
  if (!reportTitle.value.trim()) {
    alert("Le titre ne peut pas être vide.");
    return;
  }

  const reportData = {
    title: reportTitle.value,
    content: reportContent.value,
    authorId: props.existingReport?.authorId,
  };

  if (props.existingReport?.id) {
    // Update an existing report.
    await $fetch(`/api/eventHandler/${props.existingReport.id}`, {
      method: "PUT",
      body: reportData,
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
    <div class="p-2 space-y-4">
      <div>
        <label
          for="report-title"
          class="block mb-2 text-sm font-medium text-muted-foreground"
          >Titre</label
        >
        <Textarea
          id="report-title"
          v-model="reportTitle"
          placeholder="Titre du rapport"
          class="min-h-[40px] text-md"
          rows="1"
        />
      </div>
      <div>
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
  </div>
</template>
