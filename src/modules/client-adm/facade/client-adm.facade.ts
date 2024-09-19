import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

interface UsecaseProps {
  addUsecase: AddClientUsecase;
  findUsecase: FindClientUsecase;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUsecase: AddClientUsecase;
  private _findUsecase: FindClientUsecase;

  constructor({ addUsecase, findUsecase }: UsecaseProps) {
    this._addUsecase = addUsecase;
    this._findUsecase = findUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUsecase.execute({
      id: input.id,
      name: input.name,
      email: input.email,
      address: input.address,
    });
  }

  async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    const client = await this._findUsecase?.execute(input);
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}