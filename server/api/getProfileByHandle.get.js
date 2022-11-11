import db from "../../db";

export default defineEventHandler(async (event) => {
  const routeQuery = getQuery(event);
  const params = {
    TableName: "user",
    IndexName: "profileHandle-retrieveFullProfile",
    KeyConditionExpression: "profileHandle = :handle",
    ExpressionAttributeValues: {
      ":handle": routeQuery.handle,
    },
  };

  let result = null;
  await db
    .query(params)
    .promise()
    .then((data) => {
      result = data.Items;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
});
