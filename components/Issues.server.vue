<script setup lang="ts">
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner: "OpenRailAssociation",
  repo: "osrd",
  labels: "kind:bug,area:front",
  per_page: 100,
});
</script>

<template>
  <div class="mt-5">
    <p class="mb-5">Total issues: {{ issues.length }}</p>
    <ul>
      <li v-for="issue in issues" :key="issue.id">
        <a :href="issue.html_url" target="_blank">- {{ issue.title }}</a>
      </li>
    </ul>
  </div>
</template>
