export interface AddClientFacadeInputDto {
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

export interface FindClientFacadeInputDto {
  id: string;
}

export interface FindClientFacadeOutputDto {
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

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<void>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}
