import SearchInput from "@/components/home/SearchInput";
import prismadb from "@/lib/prismadb";
import Categories from "@/components/category/Categories";
import CompanionList from "@/components/companion/CompanionList";

interface HomePageProps {
    searchParams: { // searchParams is next.js's way of passing query parameters to a page. Every single server component has access to it.
        categoryId: string;
        name: string;
    }
}


// this is a server component that will be rendered on the server side. It has access to the database and can fetch data from it.
export default async function HomePage({
    searchParams
}: HomePageProps) { // localhost:3000/
    const categories = await prismadb.category.findMany();  // fetch all categories from the database
    const companion = await prismadb.companion.findMany({
        where: {
            categoryId: searchParams.categoryId,
            name: {
                search: searchParams.name // search for companions with a name that contains the search query. localhost:3000/?categoryId=1&name=yasin
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: {
                    messages: true // count the number of messages for companion
                }
            }
        }
    });

    return (
        <main className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
            <CompanionList data={companion} />
        </main>
    );
}
