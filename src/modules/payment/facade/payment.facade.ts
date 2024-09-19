import ProcessPaymentUsecase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
  private _processPaymentUsecase: ProcessPaymentUsecase;

  constructor(processPaymentUsecase: ProcessPaymentUsecase) {
    this._processPaymentUsecase = processPaymentUsecase;
  }

  async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    const transaction = await this._processPaymentUsecase.execute({
      orderId: input.orderId,
      amount: input.amount,
    });

    return {
      transactionId: transaction.transactionId,
      orderId: transaction.orderId,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
