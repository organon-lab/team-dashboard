<script setup lang="ts">
import { ref, watch, computed, defineExpose } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ParsedMarkdownType, Report } from "~/types/markdownTypes";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import { ChevronLeft, ChevronRight, Pencil, PenLine } from "lucide-vue-next";

const props = defineProps<{
  report: Report;
  reportsList?: Report[];
}>();

const emit = defineEmits([
  "back-to-list",
  "navigate",
  "edit-title",
  "edit-report",
]);

const handleBackToList = () => {
  emit("back-to-list");
};

const handleEditReport = () => {
  emit("edit-report", props.report);
};

const ast = ref<ParsedMarkdownType | null>(null);
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

const currentIndex = computed(() => {
  if (!props.reportsList || props.reportsList.length === 0) return -1;
  const sortedList = [...props.reportsList].sort((a, b) => b.id - a.id);
  return sortedList.findIndex((r) => r.id === props.report.id);
});

const sortedReports = computed(() => {
  if (!props.reportsList) return [];
  return [...props.reportsList].sort((a, b) => b.id - a.id);
});

const canNavigate = computed(() => sortedReports.value.length > 0);
const isFirst = computed(() => currentIndex.value <= 0);
const isLast = computed(
  () => currentIndex.value >= sortedReports.value.length - 1
);

const navigate = (direction: "prev" | "next") => {
  const newIndex =
    direction === "prev" ? currentIndex.value - 1 : currentIndex.value + 1;
  if (newIndex >= 0 && newIndex < sortedReports.value.length) {
    emit("navigate", sortedReports.value[newIndex]);
  }
};

const ODJ_SEPARATOR = "\n\n---ODJ_SEPARATOR---\n\n";

const parsedOdj = ref<ParsedMarkdownType | null>(null);
const parsedMainContent = ref<ParsedMarkdownType | null>(null);
const showSeparator = ref(false);

watch(
  () => props.report.content,
  async (fullContent) => {
    parsedOdj.value = null;
    parsedMainContent.value = null;
    showSeparator.value = false;

    if (!fullContent) return;

    if (fullContent.includes(ODJ_SEPARATOR)) {
      const [odjPart, mainPart] = fullContent.split(ODJ_SEPARATOR);

      if (odjPart && odjPart.trim()) {
        parsedOdj.value = await parseMarkdown(odjPart);
      }
      if (mainPart && mainPart.trim()) {
        parsedMainContent.value = await parseMarkdown(mainPart);
      }
      if (parsedOdj.value?.body && parsedMainContent.value?.body) {
        showSeparator.value = true;
      }
    } else {
      parsedMainContent.value = await parseMarkdown(fullContent);
    }
  },
  { immediate: true }
);

defineExpose({
  canNavigate,
  isFirst,
  isLast,
  navigate,
});
</script>

<template>
  <div class="p-2 sm:p-4">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
    >
      <FloatingFrontIssues />

      <div class="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2">
        <div class="flex items-center gap-2">
          <Button
            v-if="canNavigate"
            @click="navigate('prev')"
            :disabled="isFirst"
            variant="outline"
            size="icon"
            class="w-8 h-8"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>
          <Button
            v-if="canNavigate"
            @click="navigate('next')"
            :disabled="isLast"
            variant="outline"
            size="icon"
            class="w-8 h-8"
          >
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>
        <Button
          @click="handleBackToList"
          variant="outline"
          class="w-full sm:w-auto"
        >
          Retour à la liste
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center gap-x-2">
          <CardTitle class="text-lg sm:text-xl break-words">{{
            report.title
          }}</CardTitle>
        </div>
        <p class="text-xs sm:text-sm text-muted-foreground">
          Rapport #{{ report.id }} - Créé le
          {{ new Date(report.createdAt).toLocaleDateString() }}
        </p>
      </CardHeader>
      <CardContent>
        <div class="space-y-4 sm:space-y-6">
          <div v-if="parsedOdj?.body">
            <h1
              class="mb-2 text-sm sm:text-base font-semibold text-muted-foreground"
            >
              ODJ :
            </h1>
            <div
              class="markdown max-h-64 sm:max-h-96 overflow-y-auto text-sm sm:text-base"
            >
              <MDCRenderer :body="parsedOdj.body" />
            </div>
          </div>

          <Separator v-if="showSeparator" />

          <div v-if="parsedMainContent?.body">
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2"
            >
              <h1
                class="text-sm sm:text-base font-semibold text-muted-foreground"
              >
                Compte-rendu :
              </h1>
              <Button
                @click="handleEditReport"
                variant="ghost"
                size="icon"
                class="h-8 w-8 shrink-0 opacity-80 hover:opacity-100 transition-opacity self-end sm:self-auto"
                title="Éditer le compte-rendu"
              >
                <Pencil class="h-4 w-4" />
              </Button>
            </div>
            <div class="markdown text-sm sm:text-base">
              <MDCRenderer :body="parsedMainContent.body" />
            </div>
          </div>

          <p
            v-if="!parsedOdj && !parsedMainContent"
            class="text-muted-foreground italic text-sm sm:text-base"
          >
            Aucun contenu disponible.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
