import dotenv from "dotenv";
import http from "http";
import { createDBConnection } from "./db/db.connection";
import { Connection } from "typeorm";
import { app } from "./app";

dotenv.config();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(): Promise<Connection> {
  return createDBConnection();
}
startServer()
  .then((connection: Connection) => {
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Cannot create the server. Error : ", error);
    process.exit(1);
  });
