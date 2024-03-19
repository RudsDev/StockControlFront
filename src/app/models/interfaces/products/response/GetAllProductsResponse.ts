export interface GetAllProductsResponse {

  id: string,
  name: String,
  description: string,
  price: string,
  amount: number,
  category: {
    id: string,
    name: string,
  },
}
