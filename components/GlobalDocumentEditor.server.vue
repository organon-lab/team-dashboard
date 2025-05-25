<script setup lang="ts">
import { Button } from "@/components/ui/button";

const prisma = usePrismaClient();

const document = await prisma.post.findUnique({
  where: {
    id: 1,
  },
});

const actualDocument = ref<string>(document?.content || ""); 

const updateActualDocument = (newDocument: string) => {
	if (!actualDocument) {
		return;
	}
	actualDocument.value = newDocument;
};

const updateDocument = async () => {
  console.log("Updating document");
  if (!actualDocument.value) {
    console.log("Document is empty");
    return;
  }
  await prisma.post.upsert({
    where: {
      id: 1,
    },
    update: {
      content: actualDocument.value,
    },
    create: {
      content: actualDocument.value,
    },
  });
  console.log("Document updated");
};

</script>

<template>
  <div class="flex items-center justify-between p-2">
    <h1 class="text-2xl font-bold text-center text-red-400">Document Editor</h1>
    <Button @click="updateDocument" class="m-2"> Save </Button>
  </div>
  <textarea
    v-model="actualDocument"
    class="w-full h-96 p-2 border bg-stone-950 rounded-md"
    @input="updateActualDocument(actualDocument)"
  />
</template>
