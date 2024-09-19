import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  save(invoice: Invoice): Promise<Invoice>;
  find(id: string): Promise<Invoice>;
}
