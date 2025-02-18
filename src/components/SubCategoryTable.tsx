import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSubCategories } from '../utils/apiService';
import { HiOutlinePencil, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';

interface SubCategory {
  _id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  __v: number;
}

const SubCategoryTable = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const data = await fetchSubCategories();
        setSubCategories(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    getSubCategories();
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
            SubCategory
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Icon
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Color
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20">
            Category
          </th>
          <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {subCategories.map((subCategory) => (
          <tr key={subCategory._id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {subCategory.name}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 table-cell pr-8">
              <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {subCategory.icon}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="flex items-center gap-x-2 justify-start">
                <div className="dark:text-whiteSecondary text-blackPrimary block">
                  {subCategory.color}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium table-cell lg:pr-20">
              {subCategory.category}
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to={`/subcategories/${subCategory._id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link
                  to={`/subcategories/${subCategory._id}`}
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

export default SubCategoryTable;