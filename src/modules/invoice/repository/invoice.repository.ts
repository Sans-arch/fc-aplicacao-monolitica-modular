import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice_item";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice_item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async save(invoice: Invoice): Promise<Invoice> {
    const persistedInvoice = await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        items: invoice.items.map((item) => {
          return {
            id: item.id.id,
            name: item.name,
            price: item.price,
          };
        }),
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      {
        include: [
          {
            model: InvoiceItemModel,
          },
        ],
      }
    );

    return new Invoice({
      id: new Id(persistedInvoice.id),
      name: persistedInvoice.name,
      document: persistedInvoice.document,
      items: persistedInvoice.items,
      address: new Address({
        street: persistedInvoice.street,
        number: persistedInvoice.number,
        complement: persistedInvoice.complement,
        city: persistedInvoice.city,
        state: persistedInvoice.state,
        zipCode: persistedInvoice.zipCode,
      }),
    });
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [
        {
          model: InvoiceItemModel,
        },
      ],
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      items: invoice.items.map((item) => {
        return new InvoiceItem({
          id: new Id(item.id.id),
          name: item.name,
          price: item.price,
        });
      }),
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      }),
    });
  }
}
