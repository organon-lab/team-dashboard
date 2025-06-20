<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import type { Report } from "~/types/markdownTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const reports = ref<Report[]>([]);
const emit = defineEmits(["edit-report", "create-new-report"]);

const fetchAllReports = async () => {
  try {
    const data = await $fetch<Report[]>("/api/eventHandler?all=true");
    reports.value = data;
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    reports.value = [];
  }
};

const handleEdit = (report: Report) => {
  emit("edit-report", report);
};

const handleCreateNew = () => {
  emit("create-new-report");
};

onMounted(fetchAllReports);

defineExpose({
  fetchAllReports,
});
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
        <CardFooter>
          <Button @click="handleEdit(report)" variant="outline">Éditer</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
