<script setup lang="ts">
import { ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Report } from "~/types/markdownTypes";

const props = defineProps<{
  open: boolean;
  report: Report | null;
}>();

const emit = defineEmits(["update:open", "save-title"]);

const editedTitle = ref("");

// This watcher keeps the input in sync with the selected report.
watch(
  () => props.report,
  (newReport) => {
    if (newReport) {
      editedTitle.value = newReport.title;
    }
  },
  { immediate: true }
);

const handleSave = () => {
  if (!editedTitle.value.trim()) {
    alert("Title cannot be empty.");
    return;
  }
  emit("save-title", { id: props.report?.id, newTitle: editedTitle.value });
  emit("update:open", false);
};
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Éditer le titre</DialogTitle>
        <DialogDescription class="pt-2">
          Modifiez le titre de votre rapport. Cliquez sur "Enregistrer" pour
          valider.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <Input
          id="name"
          v-model="editedTitle"
          class="col-span-3"
          @keyup.enter="handleSave"
        />
      </div>
      <DialogFooter>
        <Button @click="handleSave">Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
