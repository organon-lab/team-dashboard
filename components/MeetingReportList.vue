<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-vue-next";
import type { Report } from "~/types/markdownTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

defineProps<{
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
      <Card v-for="report in reports" :key="report.id">
        <CardHeader>
          <CardTitle>{{ report.title }}</CardTitle>
          <CardDescription>
            Rapport #{{ report.id }} - Créé le
            {{ new Date(report.createdAt).toLocaleDateString() }}
          </CardDescription>
        </CardHeader>
        <CardFooter class="space-x-2">
          <Button @click="handleView(report)" variant="outline" size="sm">
            <Eye class="w-4 h-4 mr-1" />
            Visualiser
          </Button>
          <Button @click="handleEdit(report)" variant="outline" size="sm">
            <Edit class="w-4 h-4 mr-1" />
            Éditer
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
