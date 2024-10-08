export interface FindClientInputDto {
  id: string;
}

export interface FindClientOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  complement: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
