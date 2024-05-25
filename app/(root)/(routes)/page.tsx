import SearchInput from "@/components/home/SearchInput";
import prismadb from "@/lib/prismadb";
import Categories from "@/components/category/Categories";


// this is a server component that will be rendered on the server side. It has access to the database and can fetch data from it.
export default async function HomePage() { // localhost:3000/
    const categories = await prismadb.category.findMany();  // fetch all categories from the database

    return (
        <main className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
        </main>
    );
}
