import db from "../../db";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  if (
    !body.recipeId ||
    !body.parentCommentId ||
    !body.commentId ||
    !body.userId ||
    !body.commentBody
  ) {
    return;
  }
  const postRequestParams = {
    TableName: "comments",
    Item: {
      recipeId: body.recipeId,
      parentCommentId: body.parentCommentId,
      commentId: body.commentId,
      userId: body.userId,
      commentBody: body.commentBody,
      createdAt: new Date().toISOString(),
    },
  };
  let status = null;

  db.put(
    {
      TableName: "commentVotes",
      Item: {
        ridCidUid: `${body.recipeId}-${body.commentId}-${body.userId}`,
        recipeId: body.recipeId,
        commentId: body.commentId,
        userId: body.userId,
        vote: 1,
      },
    },
    (err, data) => {
      if (err) {
        status = err;
      } else {
        status = data;
      }
    }
  );

  await db
    .put(postRequestParams)
    .promise()
    .then((data) => {
      status = true;
    })
    .catch((error) => {
      status = false;
    });

  return status;
});
