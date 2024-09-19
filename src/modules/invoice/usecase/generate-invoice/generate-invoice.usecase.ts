import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Address from "../../domain/address";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice_item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUsecase implements UseCaseInterface {
  private _repository: InvoiceGateway;

  constructor(repository: InvoiceGateway) {
    this._repository = repository;
  }

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    const items: InvoiceItem[] = [];
    const address = new Address({
      city: input.city,
      complement: input.complement,
      number: input.number,
      state: input.state,
      street: input.street,
      zipCode: input.zipCode,
    });

    const invoice = new Invoice({
      name: input.name,
      items: items,
      document: input.document,
      address: address,
    });

    const persistedInvoice = await this._repository.save(invoice);

    return {
      id: persistedInvoice.id.id,
      name: persistedInvoice.name,
      document: persistedInvoice.document,
      total: persistedInvoice.total,
      city: persistedInvoice.address.city,
      complement: persistedInvoice.address.complement,
      number: persistedInvoice.address.number,
      state: persistedInvoice.address.state,
      street: persistedInvoice.address.street,
      zipCode: persistedInvoice.address.zipCode,
      items: persistedInvoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        };
      }),
    };
  }
}
