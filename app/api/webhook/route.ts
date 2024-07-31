import Stripe from "stripe";
import {headers} from "next/headers";
import {NextResponse} from "next/server";

import {stripe} from "@/lib/stripe";
import prismaDb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        // Verify the event by passing the signature and secret
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // if user is subscribing first time, we create a new record in the database.
    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("No user ID found", {status: 400});
        }

        await prismaDb.userSubscription.create({
            data: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                userId: session?.metadata?.userId,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), // Convert to milliseconds from seconds
            }
        })
    }

    // check if the event is invoice.payment_succeeded event. If yes, update the userSubscription record in the database
    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("No user ID found", {status: 400});
        }

        await prismaDb.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                stripePriceId: subscription.items.data[0].price.id,
            }
        })
    }

    return new NextResponse("Webhook received", {status: 200});
}

// checkout.session.completed and invoice.payment_succeeded are the two events that we are handling in this webhook route.
// In the checkout.session.completed event, we create a new userSubscription record in the database.
// In the invoice.payment_succeeded event, we update the userSubscription record in the database.
// checkout.session.completed event is triggered when a user completes the checkout process and invoice.payment_succeeded event is triggered when the payment is successfully processed.