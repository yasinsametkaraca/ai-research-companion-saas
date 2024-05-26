import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/CompanionForm";

interface CompanionDetailPageProps {
    params: {
        companionId: string;
    };
}

const CompanionDetailPage = async ({params}: CompanionDetailPageProps) => {
    // TODO: Fetch Subscriptions

    const companionId = params.companionId; // The companion ID from the URL path. [companionId] is a dynamic route parameter in next.js.
    const companion = await prismadb.companion.findUnique({
        where: {
            id: companionId
        }
    }); // Fetch the one companion from the database.

    const categories = await prismadb.category.findMany()

    return (
        <CompanionForm
            initialData={companion}
            categories={categories}
        />
    );
};

export default CompanionDetailPage;
