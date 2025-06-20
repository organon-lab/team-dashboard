<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Report } from "~/types/markdownTypes";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const props = defineProps<{
  report: Report;
}>();

const emit = defineEmits(["back-to-list"]);

const handleBackToList = () => {
  emit("back-to-list");
};

// Parse markdown content using Nuxt MDC
const { data: ast } = await useAsyncData(`markdown-${props.report.id}`, () =>
  parseMarkdown(props.report.content || "")
);
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Visualisation du rapport</h2>
      <Button @click="handleBackToList" variant="outline"
        >Retour à la liste</Button
      >
    </div>

    <Card>
      <CardHeader>
        <CardTitle>{{ report.title }}</CardTitle>
        <p class="text-sm text-muted-foreground">
          Rapport #{{ report.id }} - Créé le
          {{ new Date(report.createdAt).toLocaleDateString() }}
        </p>
      </CardHeader>
      <CardContent>
        <div v-if="ast?.body" class="markdown">
          <MDCRenderer :body="ast.body" :data="ast.data" />
        </div>
        <p v-else-if="report.content" class="text-muted-foreground italic">
          Erreur lors du rendu du contenu
        </p>
        <p v-else class="text-muted-foreground italic">
          Aucun contenu disponible
        </p>
      </CardContent>
    </Card>
  </div>
</template>
