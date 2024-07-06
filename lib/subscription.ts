import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000; // 24 hours in milliseconds (1000ms * 60s * 60m * 24h)

export const checkSubscription = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
        where: {
            userId
        },
        select: {
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
            stripeSubscriptionId: true,
        }
    });

    if (!userSubscription) {
        return false;
    }

    // Check if the user has an active subscription and it hasn't expired. Why do we add DAY_IN_MS to the current period end date? Because the current period end date is the end of the last billing cycle. We want to check if the subscription is still active on the current day.
    const isValid = userSubscription.stripePriceId &&
        userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid; // Convert the result to a boolean value. If the subscription is valid, return true. Otherwise, return false.
}