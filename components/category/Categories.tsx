"use client";

import {Category} from "@prisma/client";
import {cn} from "@/lib/utils";
import {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";

interface CategoriesProps {
    data: Category[];
}

const Categories = ({data}: CategoriesProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");

    const handleCategoryClick = (categoryId: string | undefined) => {
        const query = {categoryId: categoryId}; // query object to be passed to the router
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, {skipEmptyString: true, skipNull: true}); // convert query object to a query string
        router.push(url);
    } // this function will be called when a category is clicked. It will update the url with the new category id. localhost:3000/?categoryId=1

    return (
        <div className="flex space-x-2 w-full overflow-x-auto p-1.5">
            <button
                onClick={() => handleCategoryClick(undefined)}
                className={cn(`flex items-center text-center bg-primary/10 rounded-md text-xs md:text-sm py-2 md:py-3 px-2 md:px-4 hover:opacity-85 transition-opacity`, !categoryId ? "bg-primary/25" : "bg-primary/10")}
            >
                Newest
            </button>
            {data.map((category) => (
                <button
                    onClick={() => handleCategoryClick(category.id)}
                    key={category.id}
                    className={cn(`flex items-center text-center bg-primary/10 rounded-md text-xs md:text-sm py-2 md:py-3 px-2 md:px-4 hover:opacity-85 transition-opacity`, categoryId === category.id ? "bg-primary/25" : "bg-primary/10")}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default Categories;
