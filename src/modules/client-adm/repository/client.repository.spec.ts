import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      city: "",
      complement: "",
      document: "",
      number: "",
      state: "",
      street: "",
      zipCode: "",
    });

    const repository = new ClientRepository();
    await repository.add(client);

    const result = await ClientModel.findOne({ where: { id: "1" } });

    expect(result).toBeDefined();
    expect(result?.id).toBe(client.id.id);
    expect(result?.name).toBe(client.name);
    expect(result?.email).toBe(client.email);
    expect(result?.address).toBe(client.address);
  });

  it("should find a client", async () => {
    const client = await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
      city: "",
      complement: "",
      document: "",
      number: "",
      state: "",
      street: "",
      zipCode: "",
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toBe(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
