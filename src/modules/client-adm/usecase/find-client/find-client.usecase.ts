import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientGateway from "../../gateway/client.gateway";
import { FindClientInputDto, FindClientOutputDto } from "./find-client.usecase.dto";

export default class FindClientUsecase implements UseCaseInterface {
  private _clientRepository: ClientGateway;

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const client = await this._clientRepository.find(input.id);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      city: client.city,
      complement: client.complement,
      document: client.document,
      number: client.number,
      state: client.state,
      street: client.street,
      zipCode: client.zipCode,
    };
  }
}
