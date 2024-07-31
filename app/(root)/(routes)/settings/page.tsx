import React from 'react';
// @ts-ignore
import {checkSubscription} from "@/lib/subscription";
import SubscriptionButton from "@/components/subscription/SubscriptionButton";


const SettingsPage = async () => {
    const isPremium = await checkSubscription() // This will return true if the user has an active subscription, and false if they don't.

    return (
        <div className="h-full p-4 space-y-2">
            <h3 className="text-lg font-medium">Settings</h3>
            <div className="text-muted-foreground text-sm">
                {
                    isPremium ? 'You are currently subscribed to our premium plan.' : 'You are currently on a free plan.'
                }
            </div>
            <SubscriptionButton isPremium={isPremium} />
        </div>
    );
};

export default SettingsPage;
