export interface AddClientInputDto {
  id?: string;
  name: string;
  email: string;
  address: string;
  city: string;
  complement: string;
  document: string;
  number: string;
  state: string;
  street: string;
  zipCode: string;
}

export interface AddClientOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
