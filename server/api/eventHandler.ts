import { defineEventHandler, getQuery, readBody } from "h3";
import { PrismaClient } from "@prisma/client";
import { createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const query = getQuery(event);
    if (query.all === "true") {
      const allPosts = await prisma.post.findMany({
        orderBy: { id: "desc" },
      });
      return allPosts;
    }

    const lastPost = await prisma.post.findFirst({ orderBy: { id: "desc" } });
    return { content: lastPost?.content || "" };
  }

  if (event.method === "POST") {
    const body = await readBody<{
      title: string;
      content: string;
      authorId: number;
    }>(event);
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId,
      },
    });
    return { id: post.id, content: post.content || "" };
  }

  throw createError({
    statusCode: 405,
    message: "Method not allowed",
  });
});
