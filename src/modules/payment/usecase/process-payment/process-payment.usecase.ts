import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export default class ProcessPaymentUsecase implements UseCaseInterface {
  private _transactionRepository: PaymentGateway;

  constructor(transactionRepository: PaymentGateway) {
    this._transactionRepository = transactionRepository;
  }

  async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction({
      orderId: input.orderId,
      amount: input.amount,
    });

    transaction.process();

    const persistedTransaction = await this._transactionRepository.save(transaction);

    return {
      transactionId: persistedTransaction.id.id,
      orderId: persistedTransaction.orderId,
      amount: persistedTransaction.amount,
      status: transaction.status,
      createdAt: persistedTransaction.createdAt,
      updatedAt: persistedTransaction.updatedAt,
    };
  }
}
