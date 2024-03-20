export interface GetAllProductsResponse {

  id: string,
  name: string,
  description: string,
  price: string,
  amount: number,
  category: {
    id: string,
    name: string,
  },
}
