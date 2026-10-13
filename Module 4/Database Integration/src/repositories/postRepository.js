
const prisma = require("../db/prisma");

function translateDatabaseError(error) {
  if (error.code === "P2002") {
  console.error("Unique constraint error:", error);
  const translated = new Error(
    "A record with these details already exists."
  );
  translated.statusCode = 409;
  return translated;
}

  if (error.code === "P2003") {
    const translated = new Error(
      "The requested relationship is invalid."
    );
    translated.statusCode = 400;
    return translated;
  }

  return error;
}

async function findAll() {
  return prisma.post.findMany({
    orderBy: { id: "asc" },
  });
}

async function findById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
  });
}

async function create(fields) {
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || "",
        authorId: Number(fields.authorId),
      },
    });
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

async function update(id, patch) {
  const postId = Number(id);
  const data = {};

  if (patch.title !== undefined) data.title = patch.title;
  if (patch.body !== undefined) data.body = patch.body;

  try {
    const result = await prisma.post.updateMany({
      where: { id: postId },
      data,
    });

    if (result.count === 0) return null;

    return prisma.post.findUnique({
      where: { id: postId },
    });
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

async function remove(id) {
  try {
    const result = await prisma.post.deleteMany({
      where: { id: Number(id) },
    });

    return result.count > 0;
  } catch (error) {
    throw translateDatabaseError(error);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
