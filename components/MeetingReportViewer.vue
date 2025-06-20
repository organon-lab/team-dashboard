<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Report } from "~/types/markdownTypes";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  report: Report;
  reportsList?: Report[];
}>();

const emit = defineEmits(["back-to-list", "navigate"]);

const handleBackToList = () => {
  emit("back-to-list");
};

const ast = ref(null);
const parseContent = async () => {
  if (props.report.content) {
    try {
      ast.value = await parseMarkdown(props.report.content);
    } catch (error) {
      console.error("Erreur lors du parsing Markdown:", error);
      ast.value = null;
    }
  } else {
    ast.value = null;
  }
};
watch(() => props.report.content, parseContent, { immediate: true });

// Logic to allow navigation between reports
const sortedReports = computed(() => {
  if (!props.reportsList || props.reportsList.length < 2) {
    return [];
  }
  // Sort the reports by creation date, newest first
  return [...props.reportsList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const currentIndex = computed(() => {
  if (sortedReports.value.length === 0) return -1;
  return sortedReports.value.findIndex((r) => r.id === props.report.id);
});

const canNavigate = computed(() => sortedReports.value.length > 0);
const isFirst = computed(() => currentIndex.value === 0);
const isLast = computed(
  () => currentIndex.value === sortedReports.value.length - 1
);

const navigate = (direction: "prev" | "next") => {
  if (!canNavigate.value) return;

  const newIndex =
    direction === "prev" ? currentIndex.value - 1 : currentIndex.value + 1;
  if (newIndex >= 0 && newIndex < sortedReports.value.length) {
    emit("navigate", sortedReports.value[newIndex]);
  }
};
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Visualisation du rapport</h2>
      <div class="flex items-center space-x-2">
        <!-- Display the arrows only if navigation is possible -->
        <template v-if="canNavigate">
          <Button
            @click="navigate('prev')"
            :disabled="isFirst"
            variant="outline"
            size="icon"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>
          <Button
            @click="navigate('next')"
            :disabled="isLast"
            variant="outline"
            size="icon"
          >
            <ChevronRight class="w-4 h-4" />
          </Button>
        </template>
        <Button @click="handleBackToList" variant="outline"
          >Retour à la liste</Button
        >
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>{{ report.title }}</CardTitle>
        <p class="text-sm text-muted-foreground">
          Rapport #{{ report.id }} - Créé le
          {{ new Date(report.createdAt).toLocaleDateString() }}
        </p>
      </CardHeader>
      <CardContent>
        <div v-if="ast?.body" class="markdown">
          <MDCRenderer :body="ast.body" :data="ast.data" />
        </div>
        <p v-else-if="report.content" class="text-muted-foreground italic">
          Erreur lors du rendu du contenu
        </p>
        <p v-else class="text-muted-foreground italic">
          Aucun contenu disponible
        </p>
      </CardContent>
    </Card>
  </div>
</template>
