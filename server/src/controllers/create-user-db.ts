import { IDBModel } from "../commons/types";
import { createUCCreateUser } from "../core/_usecases";

const createCreateUserDB = (db: IDBModel<any>) => async u => {
  const createUser = createUCCreateUser();
  const newUser = createUser(u);
  return db.insert(newUser);
};

export { createCreateUserDB };
