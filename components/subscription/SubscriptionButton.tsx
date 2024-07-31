"use client";

import {Sparkles} from "lucide-react";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import axios from "axios";

interface SubscriptionButtonProps{
    isPremium: boolean;
}

const SubscriptionButton = ({isPremium = false}: SubscriptionButtonProps) => {
    const {toast} = useToast();
    const [loading, setLoading] = useState<boolean>(false)

    const onClick = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url;
        } catch (e) {
            setLoading(false)
            toast({
                variant: "destructive",
                title: "Something went wrong. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button disabled={loading} onClick={onClick} size="sm" variant={isPremium ? "default" : "upgrade"}>
            {isPremium ? 'Manage Subscription' : 'Upgrade'}
            {!isPremium && <Sparkles className="h-4 w-4 ml-2 fill-white" />}
        </Button>
    );
};

export default SubscriptionButton;
