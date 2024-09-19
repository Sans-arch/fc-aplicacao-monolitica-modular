import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

interface InvoiceFacadeProps {
  findInvoiceUsecase: FindInvoiceUsecase;
  generateInvoiceUsecase: GenerateInvoiceUsecase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findInvoiceUsecase: FindInvoiceUsecase;
  private _generateInvoiceUsecase: GenerateInvoiceUsecase;

  constructor(props: InvoiceFacadeProps) {
    this._findInvoiceUsecase = props.findInvoiceUsecase;
    this._generateInvoiceUsecase = props.generateInvoiceUsecase;
  }

  async findInvoice(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDTO> {
    return await this._findInvoiceUsecase.execute(input);
  }

  async generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateInvoiceUsecase.execute(input);
  }
}
