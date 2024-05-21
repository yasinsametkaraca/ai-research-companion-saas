import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/nextjs";

export default function HomePage() { // localhost:3000/
    return (
        <main>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <SignInButton/>
            </SignedOut>
        </main>
    );
}
