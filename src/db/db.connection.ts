import { createConnection, Connection } from "typeorm";

/**
 *
 */
export const createDBConnection = (): Promise<Connection> => {
  return new Promise((resolve, rejects) => {
    createConnection()
      .then((connection: Connection) => {
        console.log("Connected to DB");
        resolve(connection);
      })
      .catch((error) => {
        rejects(error);
      });
  });
};
