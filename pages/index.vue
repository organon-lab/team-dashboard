<script setup lang="ts">
import { Sun, Moon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NuxtIsland } from "#components";
import { Octokit } from "octokit";
import MeetingReportList from "@/components/MeetingReportList.vue";
import MeetingReportEditor from "@/components/MeetingReportEditor.vue";

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

const previewRef = ref();
const isEditing = ref(false);
const selectedReport = ref<any>(null);

const refreshPreview = () => {
  if (previewRef.value) {
    previewRef.value.fetchAllReports();
  }
};

const handleEditReport = (report: any) => {
  console.log("Index.vue: Émission de meetingreportlist bien reçue:", report);
  selectedReport.value = report;
  isEditing.value = true;
};

const handleCreateNewReport = () => {
  console.log("Créer nouveau rapport");
  selectedReport.value = null;
  isEditing.value = true;
};

const handleSaveReport = () => {
  console.log(`Index.vue: Sauvegarde du rapport`, selectedReport.value);
  isEditing.value = false;
  selectedReport.value = null;
  refreshPreview();
};

const handleCancelEdit = () => {
  isEditing.value = false;
  selectedReport.value = null;
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
      <!-- Right section : Meeting report list -->
      <div class="col-span-6 overflow-y-auto">
        <MeetingReportList
          ref="previewRef"
          @edit-report="handleEditReport"
          @create-new-report="handleCreateNewReport"
        />
      </div>
    </div>
  </div>
</template>
