<script setup lang="ts">
import { Sun, Moon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NuxtIsland } from "#components";
import { Octokit } from "octokit";

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
</script>

<template>
  <div class="h-screen overflow-y-hidden p-2">
    <div class="grid grid-cols-12"  style="height: 12rem">
      <h1 class="text-2xl font-bold col-span-4">OSRD frontend dashboard</h1>
      <div class="col-span-4">
        <NuxtIsland name="Weather" :props="{ issues }" />
      </div>
      <div class="col-span-4 flex justify-end">
	<div class="flex flex-col">
	<Button @click="signOut" class="m-2">
	  Sign out
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
      <div class="col-span-6 overflow-y-auto">
        <NuxtIsland name="Issues" :props="{ issues }"> </NuxtIsland>
      </div>
      <div class="col-span-6 overflow-y-auto">
        <!-- <NuxtIsland name="Tasks"> </NuxtIsland> -->
	<NuxtIsland name="GlobalDocument"> </NuxtIsland>
      </div>
    </div>
  </div>
</template>
