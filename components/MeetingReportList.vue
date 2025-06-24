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
import { ref, computed } from "vue";
import Pagination from "./Pagination.vue";

const props = defineProps<{
  reports: Report[];
}>();

const emit = defineEmits([
  "edit-report",
  "view-report",
  "create-new-report",
  "edit-title",
]);

const handleEdit = (report: Report) => {
  emit("edit-report", report);
};

const handleView = (report: Report) => {
  emit("view-report", report);
};

const handleCreateNew = () => {
  emit("create-new-report");
};

const handleEditTitle = (report: Report) => {
  emit("edit-title", report);
};

const reportsPerPage = 4;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(props.reports.length / reportsPerPage)
);
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * reportsPerPage;
  return props.reports.slice(start, start + reportsPerPage);
});
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Comptes rendus de points front</h2>
      <Button @click="handleCreateNew">Nouveau rapport</Button>
    </div>
    <div class="space-y-4">
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
                <CardTitle class="text-2xl">{{ report.title }}</CardTitle>
                <Button
                  @click="handleEditTitle(report)"
                  variant="ghost"
                  size="icon"
                  class="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardDescription>
              <div class="flex items-center justify-between px-6">
                <div class="flex items-start gap-x-2">
                  <span>
                    Rapport #{{ report.id }} - Créé le
                    {{ new Date(report.createdAt).toLocaleDateString() }}
                  </span>
                  <CollapsibleTrigger as-child>
                    <Button variant="ghost" size="icon" class="w-8 h-8 mb-4">
                      <ChevronDown
                        class="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180"
                      />
                      <span class="sr-only">Toggle summary</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <div class="flex mb-4">
                  <Button
                    @click="handleView(report)"
                    variant="outline"
                    size="sm"
                  >
                    <Eye class="w-4 h-4 mr-1" />
                    Visualiser
                  </Button>
                  <Button
                    @click="handleEdit(report)"
                    variant="outline"
                    size="sm"
                  >
                    <Edit class="w-4 h-4 mr-1" />
                    Éditer
                  </Button>
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
      class="flex justify-center items-center gap-4 mt-6"
    >
      <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" />
    </div>
  </div>
</template>
