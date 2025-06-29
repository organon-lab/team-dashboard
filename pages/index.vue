<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Sun, Moon, ThermometerSun, LogOut } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NuxtIsland } from "#components";
import { Octokit } from "octokit";
import MeetingReportList from "@/components/MeetingReportList.vue";
import MeetingReportEditor from "@/components/MeetingReportEditor.vue";
import MeetingReportViewer from "@/components/MeetingReportViewer.vue";
import Issues from "~/components/Issues.vue";
import type { Report } from "~/types/markdownTypes";

const colorMode = useColorMode();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const rawIssues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner: "OpenRailAssociation",
  repo: "osrd",
  labels: "kind:bug,area:front",
  per_page: 100,
});

const reviewCounts = ref<Record<string, number> | null>(null);
const { data: rawReviewCounts } = await useFetch<Record<string, number>>(
	"/api/maintainersCapacity",
);
if (rawReviewCounts.value) {
	reviewCounts.value = rawReviewCounts.value;
} else {
	reviewCounts.value = null;
}

const chartData = computed(() =>
  reviewCounts.value
    ? Object.entries(reviewCounts.value).map(([maintainer, reviews]) => ({
        maintainer,
        reviews,
      }))
    : [],
);

const issues = rawIssues.map((issue: any) => ({
  number: issue.number,
  title: issue.title,
  labels: (issue.labels || []).map((label: any) =>
    typeof label === "string" ? { name: label } : { name: label.name },
  ),
  created_at: issue.created_at,
  html_url: issue.html_url,
}));

const { signOut } = useAuth();

const reports = ref<Report[]>([]);
const isEditing = ref(false);
const isViewing = ref(false);
const selectedReport = ref<Report | null>(null);

const editorRef = ref();

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
</script>

<template>
  <!-- TODO : fix composants client et serveur -->
  <div class="min-h-screen flex flex-col bg-background">
    <div class="h-screen overflow-y-hidden p-2">
      <div class="flex" style="height: 12rem">
        <div class="side-header-section items-start">
          <div class="flex-col items-center gap-2 pl-2">
            <div class="flex items-center gap-2">
              <Thermometer-sun class="w-10 h-10 text-orange-500" />
              <h1 class="text-xl font-bold tracking-wide uppercase">
                OSRD Team Dashboard
              </h1>
            </div>
            <div class="self-center">
              <MaintainersChart
                :data="chartData"
                :categories="['reviews']"
                index="maintainer"
              />
            </div>
          </div>
        </div>

        <div class="mid-header-section">
          <Weather :issues="issues" />
        </div>
        <div class="side-header-section flex justify-end">
          <div class="flex flex-col">
            <Button @click="signOut" class="m-2">
              <LogOut />
            </Button>
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
            <div v-if="isEditing" class="p-4">
              <MeetingReportEditor
                ref="editorRef"
                :existing-report="selectedReport"
                @post-saved="handleSaveReport"
                @close="handleCancelEdit"
              />
            </div>
            <div v-else class="h-full">
              <Issues :issues="issues" />
            </div>
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
            @edit-report="handleEditReport"
          />
          <MeetingReportList
            v-else
            :reports="reports"
            @edit-report="handleEditReport"
            @view-report="handleViewReport"
            @create-new-report="handleCreateNewReport"
            class="flex-grow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-header-section {
  width: 30%;
}

.mid-header-section {
  width: 40%;
}
</style>
