<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits(["update:currentPage"]);

function setPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("update:currentPage", page);
  }
}

// Generate the pagination pages based on the current page and total pages
const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const result: (number | string)[] = [];
  result.push(1);
  if (current > 3) result.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  if (current < total - 2) result.push("...");
  result.push(total);
  return result;
});
</script>

<template>
  <nav class="flex items-center gap-3 select-none">
    <button
      class="px-2 py-1 rounded-md text-sm border border-input bg-background hover:bg-muted disabled:opacity-50"
      :disabled="props.currentPage === 1"
      @click="setPage(props.currentPage - 1)"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>
    <template v-for="(item, idx) in pages" :key="idx">
      <button
        v-if="typeof item === 'number'"
        class="px-3 py-1 rounded-md text-sm border border-input bg-background hover:bg-muted transition-colors"
        :class="
          item === props.currentPage
            ? 'bg-primary text-primary-foreground font-bold border-primary'
            : ''
        "
        @click="setPage(item)"
        :disabled="item === props.currentPage"
      >
        {{ item }}
      </button>
      <span v-else class="px-2 text-muted-foreground">…</span>
    </template>
    <button
      class="px-2 py-1 rounded-md text-sm border border-input bg-background hover:bg-muted disabled:opacity-50"
      :disabled="props.currentPage === props.totalPages"
      @click="setPage(props.currentPage + 1)"
    >
      <ChevronRight class="w-4 h-4" />
    </button>
  </nav>
</template>
