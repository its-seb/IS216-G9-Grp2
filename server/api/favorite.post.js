import db from "../../db";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const params = {
    TableName: "favorite",
    Item: {
      id: body.rid + body.uid.slice(9),
      rid: body.rid,
      uid: body.uid.slice(9),
    },
  };

  const result = new Promise((resolve, reject) => {
    db.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  return result;
});
