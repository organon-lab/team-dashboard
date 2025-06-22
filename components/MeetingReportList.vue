<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Eye, Edit, Pencil, ChevronDown } from "lucide-vue-next";
import type { Report } from "~/types/markdownTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ReportSummary from "./ReportSummary.vue";

defineProps<{
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
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Rapports de réunion</h2>
      <Button @click="handleCreateNew">Nouveau rapport</Button>
    </div>
    <div class="space-y-4">
      <Card v-if="reports.length === 0">
        <CardContent class="pt-6">
          <p>Aucun rapport trouvé. Créez-en un nouveau !</p>
        </CardContent>
      </Card>
      <div v-for="report in reports" :key="report.id">
        <Collapsible>
          <Card class="group">
            <CardHeader>
              <div class="flex items-center gap-x-2">
                <CardTitle class="text-xl">{{ report.title }}</CardTitle>
                <Button
                  @click="handleEditTitle(report)"
                  variant="ghost"
                  size="icon"
                  class="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Rapport #{{ report.id }} - Créé le
                {{ new Date(report.createdAt).toLocaleDateString() }}
              </CardDescription>
            </CardHeader>
            <CardFooter class="flex items-center justify-between">
              <div class="space-x-2">
                <Button @click="handleView(report)" variant="outline" size="sm">
                  <Eye class="w-4 h-4 mr-1" />
                  Visualiser
                </Button>
                <Button @click="handleEdit(report)" variant="outline" size="sm">
                  <Edit class="w-4 h-4 mr-1" />
                  Éditer
                </Button>
              </div>
              <CollapsibleTrigger as-child>
                <Button variant="ghost" size="icon" class="w-8 h-8">
                  <ChevronDown
                    class="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180"
                  />
                  <span class="sr-only">Toggle summary</span>
                </Button>
              </CollapsibleTrigger>
            </CardFooter>

            <CollapsibleContent>
              <ReportSummary :report="report" />
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  </div>
</template>
