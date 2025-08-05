<script setup lang="ts">
import { Button } from "@/components/ui/button";
import type { Report } from "~/types/markdownType";

const reports = ref<Report[]>([]);

async function fetchAllReports() {
  reports.value = await $fetch<Report[]>("/api/eventHandler?all=true");
}

const emit = defineEmits(["edit-report", "create-new-report"]);

const handleEditReport = (report: Report) => {
  console.log("GlobalDocumentPreview: emission", report);
  emit("edit-report", report);
};

const handleCreateNewReport = () => {
  emit("create-new-report");
};

defineExpose({ fetchAllReports });
onMounted(fetchAllReports);
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between p-2">
      <h1 class="text-2xl font-bold text-center text-green-400">
        Comptes rendus
      </h1>
      <div class="space-x-2">
        <!-- <Button @click="fetchAllReports" variant="outline"> Actualiser </Button> -->
        <Button
          @click="handleCreateNewReport"
          class="bg-green-600 hover:bg-green-700"
        >
          Créer nouveau rapport
        </Button>
      </div>
    </div>

    <div
      v-for="report in reports"
      :key="report.id"
      class="border border-gray-700 rounded-lg p-4"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">CR #{{ report.id }}</h3>
        <Button
          size="sm"
          class="bg-blue-600 hover:bg-blue-700"
          @click="handleEditReport(report)"
        >
          Éditer
        </Button>
      </div>

      <!-- Content preview -->
      <div class="text-gray-300 text-sm mb-3">
        {{ report.content?.substring(0, 200)
        }}{{ (report.content?.length || 0) > 100 ? "..." : "" }}
      </div>

      <div class="text-xs text-gray-500">Creation date</div>
    </div>
  </div>
</template>
