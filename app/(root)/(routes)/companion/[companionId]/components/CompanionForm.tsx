"use client";

import {Category, Companion} from "@prisma/client";
import * as z from "zod"; // Import zod. Zod is a library for data validation and parsing in JavaScript.
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import ImageUpload from "@/components/general/ImageUpload";

interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}).max(255),
    description: z.string().min(1, {message: "Description is required"}),
    instructions: z.string().min(250, {message: "Instruction require at least 250 characters"}),
    seed: z.string().min(250, {message: "seed require at least 200 characters"}),
    source: z.string().min(1, {message: "Image is required"}),
    categoryId: z.string().min(1, {message: "Category is required"})
});

const CompanionForm = ({initialData, categories}: CompanionFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            source: "",
            categoryId: ""
        } // companion form is a form that allows the user to create or edit a companion.
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <div className="space-x-2 max-w-3xl mx-auto h-full p-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                    <div className="space-x-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">General Information</h3>
                            <p className="text-sm text-muted-foreground">General information about your companion</p>
                        </div>
                        <Separator className="bg-primary/10 mt-2" />
                    </div>
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-3">
                                <FormControl>
                                    <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CompanionForm;
