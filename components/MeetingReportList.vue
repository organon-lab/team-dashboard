<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Eye, Edit, Pencil, ChevronDown } from "lucide-vue-next";
import type { Report } from "~/types/markdownTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ReportSummary from "./ReportSummary.vue";
import { ref, computed, watch } from "vue";
import Pagination from "./Pagination.vue";
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  reports: Report[];
}>();

const emit = defineEmits(["edit-report", "view-report", "create-new-report"]);

const handleEdit = (report: Report) => {
  emit("edit-report", report);
};

const handleView = (report: Report) => {
  emit("view-report", report);
};

const handleCreateNew = () => {
  emit("create-new-report");
};

const { height: windowHeight } = useWindowSize();

const reportsPerPage = computed(() => {
  const headerHeight = 180;
  const paginationHeight = 70;
  const padding = 32;
  const cardHeight = 150;
  const cardSpacing = 16;

  const available =
    windowHeight.value - headerHeight - paginationHeight - padding;
  const n = Math.floor((available + cardSpacing) / (cardHeight + cardSpacing));
  return Math.max(2, Math.min(n, 10));
});

const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.reports.length / reportsPerPage.value)
);
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * reportsPerPage.value;
  return props.reports.slice(start, start + reportsPerPage.value);
});

watch(reportsPerPage, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div ref="containerRef" class="p-2 sm:p-4 h-full flex flex-col">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 flex-shrink-0"
    >
      <FloatingFrontIssues />
      <h2 class="text-xl sm:text-2xl font-bold text-center sm:text-left">
        Comptes rendus de points front
      </h2>
      <Button @click="handleCreateNew" class="w-full sm:w-auto"
        >Nouveau rapport</Button
      >
    </div>

    <!-- Reports list with flex-grow to take available space -->
    <div class="space-y-4 flex-grow overflow-y-auto">
      <Card v-if="props.reports.length === 0">
        <CardContent class="pt-6">
          <p>Aucun rapport trouvé. Créez-en un nouveau !</p>
        </CardContent>
      </Card>

      <div v-for="report in paginatedReports" :key="report.id">
        <Collapsible>
          <Card class="group">
            <CardHeader>
              <div class="flex items-center gap-x-2">
                <CardTitle class="text-lg sm:text-2xl break-words">{{
                  report.title
                }}</CardTitle>
              </div>
            </CardHeader>
            <CardDescription>
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 sm:px-6 mb-4"
              >
                <div class="text-sm sm:text-base">
                  <span class="block sm:inline">
                    Rapport #{{ report.id }} - Créé le
                    {{ new Date(report.createdAt).toLocaleDateString() }}
                  </span>
                </div>

                <div
                  class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <div class="flex gap-2">
                    <Button
                      @click="handleView(report)"
                      variant="outline"
                      size="sm"
                      class="flex-1 sm:flex-none"
                    >
                      <Eye class="w-4 h-4 mr-1" />
                      <span class="hidden sm:inline">Visualiser</span>
                      <span class="sm:hidden">Voir</span>
                    </Button>
                    <Button
                      @click="handleEdit(report)"
                      variant="outline"
                      size="sm"
                      class="flex-1 sm:flex-none"
                    >
                      <Edit class="w-4 h-4 mr-1" />
                      <span class="hidden sm:inline">Éditer</span>
                      <span class="sm:hidden">Modif</span>
                    </Button>
                  </div>
                  <CollapsibleTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="w-full sm:w-8 h-8"
                    >
                      <ChevronDown
                        class="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180"
                      />
                      <span class="sr-only">Toggle summary</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </CardDescription>

            <CollapsibleContent>
              <ReportSummary :report="report" />
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>

    <div
      v-if="totalPages > 1"
      class="flex justify-center items-center gap-4 mt-6 flex-shrink-0"
    >
      <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" />
    </div>
  </div>
</template>
