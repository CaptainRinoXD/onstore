interface ICart {
    "_id": string;
    "quantity": number;
    "detail": IProduct
}
interface IProduct {
    _id: string;
    name: string;
    description: string;
    coll: string;
    price: number;
    category: string;
    type: string;
    size: string;
    color: string;
    brand: string;
    material?: string;
    stock: number;
    createdAt: Date;
    images: string[];
    discountPrice?: number;
    averageRating?: number;
    reviews: {
      username: string;
      rating: number;
      text: string;
    }[];
    careInstructions?: string;
    releaseDate?: Date;
  }
  

interface IOrder {
  "_id": string;
    "userId": string;
    "total": number;
    "address": string;
    "phone": string;
    "pay": string; 
    "createdAt": Date;
    "detail": IDetailOrder[];
    "items": IDetailOrder[]
}

interface IDetailOrder {
    "productId": string;
    "product": IProduct;
    "quantity": number;
    "price": number;
  "_id": string;

}