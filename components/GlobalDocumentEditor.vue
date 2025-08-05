<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import type { Report } from "~/types/markdownType";

const props = defineProps<{
  existingReport?: Report | null;
}>();

const actualDocument = ref<string>("");
const emit = defineEmits(["post-saved"]);

// Pre-fill with existing content if provided
watch(
  () => props.existingReport,
  (newReport) => {
    if (newReport) {
      actualDocument.value = newReport.content || "";
    } else {
      actualDocument.value = "";
    }
  },
  { immediate: true }
);

const savePost = async () => {
  if (!actualDocument.value) return;

  if (props.existingReport) {
    // Update an existing report
    await $fetch(`/api/eventHandler/${props.existingReport.id}`, {
      method: "PUT",
      body: { content: actualDocument.value },
    });
  } else {
    // Create a new report
    await $fetch("/api/eventHandler", {
      method: "POST",
      body: { content: actualDocument.value },
    });
  }

  emit("post-saved");
};
</script>

<template>
  <div class="flex items-center justify-between p-2">
    <h1 class="text-2xl font-bold text-center text-red-400">Document Editor</h1>
    <Button @click="savePost" class="m-2"> Save </Button>
  </div>
  <textarea v-model="actualDocument" />
</template>
