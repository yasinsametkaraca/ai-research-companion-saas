import {auth, currentUser} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";
import {checkSubscription} from "@/lib/subscription";

// This is an example of a PATCH request handler. For update a companion. Endpoint: /api/companion/[companionId]
export async function PATCH(req: Request, {params}: {params: {companionId: string}}) {
    try {
        const body = await req.json(); // Parse the request body as JSON.
        const user = await currentUser(); // Get the current user.
        const {name, description, instructions, seed, categoryId, source } = body; // Destructure the request body.

        if (!params.companionId) {
            return new NextResponse("Companion ID is required.", {status: 400});
        }

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

        // Update the companion in the database.
        const companion = await prismadb.companion.update({
            where: {
                id: params.companionId,
                userId: user.id,
            },
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
        return NextResponse.json(companion, {status: 200})

    } catch (error) {
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

// This is an example of a DELETE request handler. For delete a companion. Endpoint: /api/companion/[companionId]

export async function DELETE(req: Request, {params}: {params: {companionId: string}}) {
    try {
        const { userId } = auth();

        if (!params.companionId) {
            return new NextResponse("Companion ID is required.", {status: 400});
        }

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const companion = await prismadb.companion.delete({
            where: {
                userId,
                id: params.companionId
            }
        }); // if user is not the owner of the companion, it will throw an error.

        return NextResponse.json(companion)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}