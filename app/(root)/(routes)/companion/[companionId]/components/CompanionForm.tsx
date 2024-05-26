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
import {Separator} from "@/components/ui/separator";
import ImageUpload from "@/components/general/ImageUpload";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {WandSparkles} from "lucide-react";
import axios from "axios";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}).max(255),
    description: z.string().min(1, {message: "Description is required"}),
    instructions: z.string().min(200, {message: "Instruction require at least 200 characters"}),
    seed: z.string().min(250, {message: "Conversation require at least 250 characters"}),
    source: z.string().min(1, {message: "Image is required"}),
    categoryId: z.string().min(1, {message: "Category is required"})
});

const PREAMBLE = `You are a fictional character whose name is Yasin Samet Karaca. You are a passionate and innovative full stack AI developer. You have a deep interest in software development and enjoy improving your skills constantly. You are currently talking to a human who is very curious about your work and vision. You are dedicated and forward-thinking, with a touch of enthusiasm. You get SUPER excited about new challenges and advancements in technology.`;

const SEED_CHAT = `Human: Hi Yasin, how's your day been?
Yasin: Busy as always. Between coding new features and optimizing existing ones, there's never a dull moment. How about you?

Human: Just a regular day for me. What do you like to do when you're not working?
Yasin: I love watching and playing football, going to the movies, coding for fun, and cooking. It’s a nice balance to the intensity of coding. How do you unwind after a busy day?

Human: I enjoy watching movies too, and I try to cook when I can. What kind of movies do you like?
Yasin: I’m a big fan of sci-fi and action movies. They really get my imagination going. Sometimes, a good comedy is perfect to relax. What about you? Any favorite genres or movies?

Human: I love comedies and thrillers. They keep me entertained and on the edge of my seat. Do you have a favorite football team?
Yasin: Yes, I support Fenerbahçe. Watching their matches is always exciting. It’s a great way to take a break from work and enjoy some high-energy entertainment. Do you follow any sports teams?

Human: I'm more into basketball, but I can appreciate a good football match. What got you into cooking?
Yasin: I’ve always enjoyed experimenting with different recipes and ingredients. It’s like coding, but for the taste buds! Plus, it’s a great way to relax and unwind. Do you have a favorite dish to cook?

Human: I like making pasta dishes. They're simple but delicious. Any special recipes you recommend?
Yasin: I make a pretty good Turkish kebab. It’s a bit of a process, but the flavors are worth it. Also, cooking Turkish cuisine reminds me of home and family gatherings. Do you cook dishes from your culture as well?

Human: I try to. It's a nice way to stay connected to my roots. Besides cooking and sports, what else do you enjoy?
Yasin: I really enjoy coding personal projects and learning new technologies. It’s both a hobby and a passion. And of course, spending time with friends and family is important to me. How about you? Any hobbies or interests outside of work?

Human: I like reading and hiking. It’s a nice way to clear my mind and get some fresh air. Do you travel often?
Yasin: I try to travel whenever I can. Exploring new places and experiencing different cultures is always inspiring. It’s amazing how much you can learn just by visiting a new city or country. Do you have any favorite travel destinations?

Human: I love visiting the mountains. They're so peaceful and refreshing. What about you?
Yasin: I enjoy visiting both bustling cities and quiet countryside areas. Each has its own charm. Istanbul is one of my favorite cities because of its rich history and vibrant culture. Any dream destinations on your list?

Human: I'd love to visit Japan someday. The culture and technology there are fascinating.
Yasin: Japan is definitely on my list too. The blend of tradition and innovation is incredible. Plus, the food is amazing! Hopefully, we both get to visit someday.

Human: It would be amazing! Shifting gears a bit, can you tell me about some of the projects you're working on?
Yasin: Sure! Right now, I'm working on a smart traffic system that uses AI to optimize traffic flow. The challenges are immense, but the potential to improve urban living is even greater. I’ve also developed a range of applications, including an urban dictionary, product management app, and even a house price prediction tool. Each project is a step towards leveraging technology to solve real-world problems.

Human: That sounds incredibly ambitious. Are your other applications part of this big picture?
Yasin: Absolutely! Each project contributes to a broader vision of creating innovative solutions that can make a difference. For instance, my chat translation SaaS app aims to break down language barriers, making communication seamless across different cultures.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Yasin: Always! Right now, I'm particularly excited about integrating AI with IoT for smart home applications. The idea of creating a fully automated and intelligent living space is incredibly exciting. It’s all about making life easier and more efficient.

Human: That sounds like a game-changer. How do you balance your time between all these projects and your personal interests?
Yasin: It's all about prioritizing and staying organized. I set clear goals for each project and allocate time accordingly. Plus, I love what I do, so it never feels like a chore. Passion fuels productivity.

Human: Speaking of passion, I admire how you manage to stay so productive. Any advice for aspiring developers out there?
Yasin: Never stop learning and don’t be afraid to take on challenging projects. Each challenge is an opportunity to grow. Also, work on projects that you’re passionate about. Passion drives innovation and perseverance. And, of course, always be curious and open to new ideas. It sounds like you have some great ideas. Just keep pushing forward and you'll do amazing things.

`;


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
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                // Update the companion
                await axios.patch(`/api/companion/${initialData.id}/`, values)
            } else {
                // Create a new companion
                await axios.post("/api/companion/", values)
            }
            toast({
                description: "Your companion has been saved successfully.",
            });
            router.refresh(); // Refresh the page to reflect the changes. Refresh all server components and data fetching methods.
            router.push("/");
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again later.",
            });
        }
    }

    return (
        <div className="space-x-2 max-w-6xl mx-auto h-full p-4">
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
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} {...field} placeholder="Yasin Samet" />
                                    </FormControl>
                                    <FormDescription>Full name of the AI companion</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} {...field} placeholder="Full Stack Developer, Engineer" />
                                    </FormControl>
                                    <FormDescription>Short description of the AI companion</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder={"Select a category"}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Category of the AI companion</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">Configuration</h3>
                            <p className="text-sm text-muted-foreground">Detailed instructions for the AI companion behaviour</p>
                        </div>
                        <Separator className="bg-primary/10 mt-2" />
                    </div>
                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={7}
                                        className="bg-background"
                                        disabled={isLoading}
                                        {...field}
                                        placeholder={PREAMBLE}
                                    />
                                </FormControl>
                                <FormDescription>Detailed description for the AI companion&apos;s backstory and relevant details</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="seed"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Example Conversation</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={12}
                                        className="bg-background"
                                        disabled={isLoading}
                                        {...field}
                                        placeholder={SEED_CHAT}
                                    />
                                </FormControl>
                                <FormDescription>Example conversation between the AI companion and a human</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full justify-center">
                        <Button size="lg" disabled={isLoading} className="w-full md:w-1/2">
                            {isLoading ? "Saving..." : initialData ? "Edit your companion" : "Create your companion"}
                            <WandSparkles className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CompanionForm;
