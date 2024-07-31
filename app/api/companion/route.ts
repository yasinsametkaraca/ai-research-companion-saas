import {NextResponse} from "next/server";
import {currentUser} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import {checkSubscription} from "@/lib/subscription";

// This is an example of a POST request handler. For create a new companion. Endpoint: /api/companion/
export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse the request body as JSON.
        const user = await currentUser(); // Get the current user.
        const {name, description, instructions, seed, categoryId, source } = body; // Destructure the request body.

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!name || !description || !instructions || !seed || !categoryId || !source) {
            return new NextResponse("Missing require fields.", {status: 400});
        }

        const isPremium = await checkSubscription(); // Check if the user is premium.
        if (!isPremium) {
            return new NextResponse("Premium subscription required.", {status: 403});
        }

        // Create a new companion in the database.
        const companion = await prismadb.companion.create({
            data: {
                name,
                description,
                instructions,
                seed,
                categoryId,
                source,
                userId: user.id,
                userName: user.firstName
            }
        });
        return NextResponse.json(companion, {status: 201})

    } catch (error) {
        return new NextResponse("Internal Server Error", {status: 500});
    }
}