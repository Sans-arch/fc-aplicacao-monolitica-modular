import Product from "../domain/product.entity";

export default interface ProductGateway {
  add(product: any): Promise<void>;
  find(id: string): Promise<Product>;
}
