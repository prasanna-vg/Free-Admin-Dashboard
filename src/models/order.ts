export default interface Order {
    _id: string;
    orderItems: {
      _id: string;
      quantity: number;
      product: {
        _id: string;
        name: string;
        description: string;
        richDescription: string;
        image: string;
        brand: string;
        price: number;
        category: {
          _id: string;
          name: string;
          icon: string;
          color: string;
          __v: number;
        };
        subCategory: string;
        countInStock: number;
        rating: string;
        numReviews: number;
        isFeatured: boolean;
        dateCreated: string;
        __v: number;
        id: string;
      };
      __v: number;
    }[];
    shippingAddress1: string;
    shippingAddress2: string;
    city: string;
    zip: string;
    country: string;
    phone: string;
    status: string;
    totalPrice: number;
    user: {
      _id: string;
      name: string;
      id: string;
    };
    __v: number;
    id: string;
  }