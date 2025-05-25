<script setup lang="ts">
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

const prisma = usePrismaClient();

const md = `
# Hello MDC <br />
___
[mdc doc](https://nuxt.com/modules/mdc) 

<br />

*italic* <br />
**bold** <br /> 
~~rate~~ <br />

<br />

\`\`\`
code
\`\`\`

<br />

\`\`\`js
const test = "code test"
console.log(test)
\`\`\`

<br />

- bla
- rebla
- et rerebla

<br />

- [ ] test
- [x] test

<br />

> test <br />
> retest

<br />

|col1|col2|col3|
|---|---|---|
|test|test|test|
|test|test|test|
|test|test|test|
|test|test|test|

<br />

![cthulhu](https://www.pngall.com/wp-content/uploads/13/Cthulhu-Monster-PNG-Clipart.png)
`;

const document = await prisma.post.findUnique({
	where: {
		id: 1,
	},
});

const { data: ast } = await useAsyncData("markdown", () => parseMarkdown(document?.content || md));
</script>

<template>
	<div class="markdown p-2">
		<MDCRenderer v-if="ast?.body" :body="ast.body" :data="ast.data" />
	</div>
</template>
