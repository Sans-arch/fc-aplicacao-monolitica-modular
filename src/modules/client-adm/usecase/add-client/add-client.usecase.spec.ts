import AddClientUsecase from "./add-client.usecase";
import { AddClientInputDto } from "./add-client.usecase.dto";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client Usecase unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUsecase(repository);

    const input: AddClientInputDto = {
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.address).toBe(input.address);
  });
});
