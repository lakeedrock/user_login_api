import {
  createConnection,
  EntityMetadata,
  getConnection,
  Repository,
} from "typeorm";

export const connection = {
  async create(): Promise<void> {
    await createConnection();
  },
  async close(): Promise<void> {
    await getConnection().close();
  },
  async clear(): Promise<void> {
    const connection = getConnection();
    const entities: EntityMetadata[] = connection.entityMetadatas;

    for (const entity of entities) {
      const repository: Repository<any> = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  },
};
