<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar";
import { show } from "@unovis/ts/components/tooltip/style";

const props = defineProps<{
  data: Array<Record<string, any>>;
  categories: string[];
  index: string;
}>();
</script>

<template>
  <div class="bar-chart">
    <BarChart
      :data="props.data"
      :categories="props.categories"
      :index="props.index"
      :rounded-corners="4"
      :margin="{
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      }"
      :show-x-axis="false"
    />
  </div>
</template>

<style scoped>
.bar-chart {
  > div {
    height: 120px;
  }
}
</style>
