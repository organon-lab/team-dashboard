<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Sun, Moon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NuxtIsland } from "#components";
import { Octokit } from "octokit";
import MeetingReportList from "@/components/MeetingReportList.vue";
import MeetingReportEditor from "@/components/MeetingReportEditor.vue";
import MeetingReportViewer from "@/components/MeetingReportViewer.vue";
import TitleEditDialog from "@/components/TitleEditDialog.vue";
import type { Report } from "~/types/markdownTypes";

const colorMode = useColorMode();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner: "OpenRailAssociation",
  repo: "osrd",
  labels: "kind:bug,area:front",
  per_page: 100,
});

const { signOut } = useAuth();

const reports = ref<Report[]>([]);
const isEditing = ref(false);
const isViewing = ref(false);
const selectedReport = ref<Report | null>(null);

// State for the title editing modal
const isTitleEditorOpen = ref(false);
const reportForTitleEdit = ref<Report | null>(null);

const fetchAllReports = async () => {
  try {
    const data = await $fetch<Report[]>("/api/eventHandler?all=true");
    reports.value = data;
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    reports.value = [];
  }
};

onMounted(fetchAllReports);

const handleEditReport = (report: Report) => {
  selectedReport.value = report;
  isEditing.value = true;
  isViewing.value = true;
};

const handleViewReport = (report: Report) => {
  selectedReport.value = report;
  isViewing.value = true;
  isEditing.value = false;
};

const handleNavigate = (newReport: Report) => {
  selectedReport.value = newReport;
};

const handleCreateNewReport = () => {
  selectedReport.value = null;
  isEditing.value = true;
  isViewing.value = false;
};

const handleSaveReport = () => {
  isEditing.value = false;
  isViewing.value = false;
  selectedReport.value = null;
  fetchAllReports();
};

const handleCancelEdit = () => {
  isEditing.value = false;
  isViewing.value = false;
  selectedReport.value = null;
};

const handleBackToList = () => {
  isViewing.value = false;
  selectedReport.value = null;
};

const handleOpenTitleEditor = (report: Report) => {
  reportForTitleEdit.value = report;
  isTitleEditorOpen.value = true;
};

const handleSaveTitle = async ({
  id,
  newTitle,
}: {
  id: number;
  newTitle: string;
}) => {
  try {
    await $fetch(`/api/eventHandler/${id}`, {
      method: "PUT",
      body: { title: newTitle },
    });
    // Close the dialog and refresh the list
    isTitleEditorOpen.value = false;
    await fetchAllReports();
  } catch (error) {
    console.error("Failed to save title:", error);
  }
};
</script>

<template>
  <div class="h-screen overflow-y-hidden p-2">
    <div class="grid grid-cols-12" style="height: 12rem">
      <h1 class="text-2xl font-bold col-span-3">OSRD frontend dashboard</h1>
      <div class="col-span-6">
        <NuxtIsland name="Weather" :props="{ issues }" />
      </div>
      <div class="col-span-3 flex justify-end">
        <div class="flex flex-col">
          <Button @click="signOut" class="m-2"> Sign out </Button>
          <Button
            @click="
              colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
            "
            class="m-2 w-fit ml-auto"
          >
            <component :is="colorMode.value === 'light' ? Sun : Moon" />
          </Button>
        </div>
      </div>
    </div>
    <Separator />
    <div class="grid grid-cols-12" style="height: calc(100vh - 12rem)">
      <!-- Left section : Tasks or markdown editor -->
      <div class="col-span-6 overflow-y-auto">
        <ClientOnly>
          <template v-if="isEditing">
            <div class="p-4">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">
                  {{
                    selectedReport
                      ? `Éditer rapport #${selectedReport.id}`
                      : "Nouveau rapport"
                  }}
                </h2>
                <div class="space-x-2">
                  <Button @click="handleCancelEdit" variant="outline"
                    >Annuler</Button
                  >
                </div>
              </div>
              <MeetingReportEditor
                :existing-report="selectedReport"
                @post-saved="handleSaveReport"
              />
            </div>
          </template>
          <template v-else>
            <NuxtIsland name="Issues" :props="{ issues }" />
          </template>
        </ClientOnly>
      </div>
      <!-- Right section : Meeting report list or viewer -->
      <div class="col-span-6 overflow-y-auto">
        <MeetingReportViewer
          v-if="isViewing && selectedReport"
          :report="selectedReport"
          :reports-list="reports"
          @back-to-list="handleBackToList"
          @navigate="handleNavigate"
        />
        <MeetingReportList
          v-else
          :reports="reports"
          @edit-report="handleEditReport"
          @view-report="handleViewReport"
          @create-new-report="handleCreateNewReport"
          @edit-title="handleOpenTitleEditor"
        />
      </div>
    </div>

    <TitleEditDialog
      :open="isTitleEditorOpen"
      :report="reportForTitleEdit"
      @update:open="isTitleEditorOpen = $event"
      @save-title="handleSaveTitle"
    />
  </div>
  <FloatingFrontIssues />
</template>
