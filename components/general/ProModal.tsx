"use client";

import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {useProModal} from "@/hooks/useProModal";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import axios from "axios";

const ProModal = () => {
    const proModal = useProModal(); // Hook to open and close modal state. Zustand store for modal state.
    const {toast} = useToast();
    const [loading, setLoading] = useState<boolean>(false)
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url;
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong. Please try again.",
            })
        } finally {
            setLoading(false);
        }
    }

    if (!isMounted) return null;

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">Update the Premium?</DialogTitle>
                    <DialogDescription className="text-center space-y-2">
                        Create<span className="font-medium mx-1 text-sky-500">Custom AI</span>Research Companions.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex justify-between">
                    <p className="text-2xl font-medium">
                        ₺9
                        <span className="text-sm font-normal">
                            .99 / month
                        </span>
                    </p>
                    <Button disabled={loading} onClick={onSubscribe} variant="upgrade">
                        Subscribe
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProModal;
