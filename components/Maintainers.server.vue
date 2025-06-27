<script setup lang="ts">
const { reviewCounts } = defineProps<{
  reviewCounts: Record<string, number>;
}>();

const sorted = Object.entries(reviewCounts).sort(([, a], [, b]) => b - a);
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Maintainer</TableHead>
        <TableHead class="text-right">Requested Reviews</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="[name, count] in sorted" :key="name">
        <TableCell>{{ name }}</TableCell>
        <TableCell class="text-right">{{ count }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
