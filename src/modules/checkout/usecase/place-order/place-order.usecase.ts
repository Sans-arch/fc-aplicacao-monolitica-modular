import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUsecase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;

  constructor(clientFacade: ClientAdmFacadeInterface) {
    this._clientFacade = clientFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });

    if (!client) {
      throw new Error("Client not found");
    }

    // validar produtos.
    // recuperar os produtos

    // criar objeto do client
    // criar objeto da order(client, products)

    // processpayment -> paymentfacade.processs (orderId, amount)

    // caso pagamento seja aprovado -> gerar invoice
    // mudar status da minha order para approved
    // retornar dto

    return {
      id: "123",
      invoiceId: "123",
      status: "success",
      total: 100,
      products: input.products,
    };
  }
}
