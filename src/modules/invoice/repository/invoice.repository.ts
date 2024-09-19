import Invoice from "../domain/invoice";
import InvoiceGateway from "../gateway/invoice.gateway";

export default class InvoiceRepository implements InvoiceGateway {
  async save(invoice: Invoice): Promise<Invoice> {
    // Save invoice in database
  }

  async find(id: string): Promise<Invoice> {
    // Find invoice in database
  }
}
