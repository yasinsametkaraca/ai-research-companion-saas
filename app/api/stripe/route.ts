import {auth, currentUser} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

import {stripe} from "@/lib/stripe";
import prismaDb from "@/lib/prismadb";
import {absoluteUrl} from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const {userId} = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const userSubscription = await prismaDb.userSubscription.findUnique({
            where: {
                userId
            }
        });

        // if user has a subscription, create a billing portal session, and redirect the user to the portal.
        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl // redirect the user back to the settings page after they are done with the billing portal
            });

            return new NextResponse(JSON.stringify({url: stripeSession.url}), {status: 200});
        }

        // if user does not have a subscription, redirect the user to the checkout page.
        const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            billing_address_collection: "auto", // collect the billing address from the user
            customer_email: user.emailAddresses[0].emailAddress, // use the user's email address as the customer email
            line_items: [
                {
                    price_data: {
                        currency: "TRY",
                        product_data: {
                            name: "Research Companion Premium Subscription",
                            description: "Create ai companion | Unlock premium features | YSK",
                        },
                        unit_amount: 999, // $9.99
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId,
                email: user.emailAddresses[0].emailAddress
            },
            success_url: settingsUrl,
            cancel_url: settingsUrl
        });

        return new NextResponse(JSON.stringify({url: stripeSession.url}), {status: 200});

    } catch (error) {
        console.error("STRIPE_GET", error);
        return new NextResponse("Internal server error", {status: 500})
    }
}