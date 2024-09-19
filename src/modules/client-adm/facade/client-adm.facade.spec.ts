import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import { AddClientFacadeInputDto, FindClientFacadeInputDto } from "./client-adm.facade.interface";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("ClientAdm Facade test", () => {
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
    const facade = ClientAdmFacadeFactory.create();

    const input: AddClientFacadeInputDto = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
    };
    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: input.id } });

    expect(client).toBeDefined();
    expect(client?.id).toBe(input.id);
    expect(client?.name).toBe(input.name);
    expect(client?.email).toBe(input.email);
    expect(client?.address).toBe(input.address);
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
    });

    const input: FindClientFacadeInputDto = { id: "1" };
    const client = await facade.find(input);

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe("Client 1");
    expect(client.email).toBe("x@x.com");
    expect(client.address).toBe("Address 1");
  });
});