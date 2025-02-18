import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../utils/apiService';
import { HiOutlinePencil, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';

interface Product {
  _id: string;
  name: string;
  description: string;
  richDescription: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  category: string;
  subCategory: string;
  countInStock: number;
  rating: string;
  numReviews: number;
  isFeatured: boolean;
}

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>
      <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
            Product
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            SKU
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Status
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20">
            Price
          </th>
          <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {products.map((product) => (
          <tr key={product._id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {product.name}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 table-cell pr-8">
              <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {product._id}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="flex items-center gap-x-2 justify-start">
                <div className={product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}>
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="dark:text-whiteSecondary text-blackPrimary block">
                  {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium table-cell lg:pr-20">
              ${product.price}
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to={`/products/${product._id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link
                  to={`/products/${product._id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlineEye className="text-lg" />
                </Link>
                <Link
                  to="#"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlineTrash className="text-lg" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;