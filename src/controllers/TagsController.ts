import { PrismaClient, Tag } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/responses";

const prisma = new PrismaClient();

export default class TagsController {
  // Get all tags with related data
  get = asyncHandler(async (req, res) => {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    successResponse(res, tags);
  });

  // Upsert multiple tags
  upsert = async (tags: (Tag | string)[] | undefined) => {
    return await Promise.all(
      tags
        ? tags.map(async (tag) => {
            if (typeof tag !== "string") {
              const title = tag.title;
              tag = title;
            }

            const upsertedTag = await prisma.tag.upsert({
              where: { title: tag },
              update: { title: tag },
              create: { title: tag },
            });

            return upsertedTag;
          })
        : []
    );
  };

  // Update or create a tag based on the title
  updateOrCreate = asyncHandler(async (req, res) => {
    const { title } = req.body;

    const updatedOrCreatedTag = await prisma.tag.upsert({
      where: { title },
      update: { title },
      create: { title },
    });

    successResponse(res, updatedOrCreatedTag);
  });

  // Delete a tag by ID
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.tag.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(200).json({});
  });
}
