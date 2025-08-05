<script setup lang="ts">
import { ref } from "vue";
import { ListTodo, Plus, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const issues = ref<string[]>([]);
const showList = ref(false);
const showAddDialog = ref(false);
const newIssue = ref("");

const handleAddIssue = () => {
  if (newIssue.value.trim()) {
    issues.value.push(newIssue.value.trim());
    newIssue.value = "";
    showAddDialog.value = false;
  }
};

const handleRemoveIssue = (idx: number) => {
  issues.value.splice(idx, 1);
};
</script>

<template>
  <div>
    <Button
      class="rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600 dark:text-white"
      @click="showList = !showList"
      size="icon"
    >
      <ListTodo class="w-8 h-8" />
    </Button>
  </div>

  <div
    v-if="showList"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
  >
    <div
      class="w-[600px] border border-border rounded-xl shadow-xl p-4 flex flex-col gap-2 animate-fade-in bg-background"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-lg mx-auto"
          >Sujet front en suspens</span
        >
        <Button variant="ghost" size="icon" @click="showList = false">
          <X class="w-5 h-5" />
        </Button>
      </div>
      <ul class="flex flex-col gap-2 max-h-60 overflow-y-auto">
        <li
          v-for="(issue, idx) in issues"
          :key="idx"
          class="flex items-center justify-between rounded px-2 py-1"
        >
          <span class="truncate cursor-default" :title="issue">{{
            issue
          }}</span>
          <Button variant="ghost" size="icon" @click="handleRemoveIssue(idx)">
            <X class="w-4 h-4" />
          </Button>
        </li>
        <li
          v-if="issues.length === 0"
          class="text-muted-foreground italic text-sm text-center py-4"
        >
          Aucun sujet en suspens
        </li>
      </ul>
      <Button
        class="mt-2 py-1 text-sm w-56 mx-auto"
        variant="outline"
        @click="showAddDialog = true"
      >
        <Plus class="w-4 h-4 mr-1" /> Ajouter un sujet
      </Button>
    </div>
  </div>

  <Dialog :open="showAddDialog" @update:open="showAddDialog = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nouveau sujet front</DialogTitle>
      </DialogHeader>
      <Input
        v-model="newIssue"
        @keyup.enter="handleAddIssue"
        type="text"
        placeholder="Décris la problématique..."
        class="px-3 py-2 mt-2 focus:outline-none focus:ring"
        autofocus
      />
      <DialogFooter>
        <Button @click="handleAddIssue" :disabled="!newIssue.trim()"
          >Ajouter</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
