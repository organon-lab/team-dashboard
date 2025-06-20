<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import type { Report } from "~/types/markdownTypes";
import { Textarea } from "./ui/textarea";

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
      body: {
        title: props.existingReport.title || "Sans titre",
        content: actualDocument.value,
        authorId: props.existingReport.authorId || 1,
      },
    });
  } else {
    // Create a new report
    await $fetch("/api/eventHandler", {
      method: "POST",
      body: {
        title: "Nouveau rapport",
        content: actualDocument.value,
        authorId: 1,
      },
    });
  }

  emit("post-saved");
};
</script>

<template>
  <div class="flex items-center justify-between p-2">
    <h1 class="text-2xl font-bold text-center text-red-400">
      Meeting Report Editor
    </h1>
    <Button @click="savePost" class="m-2"> Save </Button>
  </div>
  <Textarea v-model="actualDocument" />
</template>
