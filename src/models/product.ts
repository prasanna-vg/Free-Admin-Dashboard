export default interface Product {
    _id: string;
    name: string;
    description: string;
    richDescription: string;
    image: string;
    images: string[];
    brand: string;
    price: number;
    category: {
      _id: string;
      name: string;
      icon: string;
      color: string;
      __v: number;
    };
    subCategory: {
      _id: string;
      name: string;
      icon: string;
      color: string;
      category: string;
      __v: number;
      id: string;
    };
    countInStock: number;
    rating: string;
    numReviews: number;
    isFeatured: boolean;
    dateCreated: string;
    __v: number;
    id: string;
  }