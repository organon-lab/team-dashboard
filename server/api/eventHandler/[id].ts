import { defineEventHandler } from "h3";
import { PrismaClient } from "@prisma/client";
import { createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.method === "PUT") {
    const id = parseInt(event.context.params?.id || "0");
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID is required for PUT request",
      });
    }

    const body = await readBody<{
      title: string;
      content: string;
      authorId: number;
    }>(event);
    const post = await prisma.post.update({
      where: { id },
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
