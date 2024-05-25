"use client"

import {useEffect, useState} from "react";
import {CldUploadButton} from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (source: string) => void;
    disabled?: boolean;
}

// cloudinary is a cloud service that offers a solution to a common problem: storing and serving images and videos.
const ImageUpload = ({value, onChange, disabled}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);  // If we are mounted so this use effect which switches the isMounted to true is only going to run once we finish server side rendering (we want to return null in ssd because hydration error can occur) and get to the client side rendering. So this is a way to prevent the hydration error.
    }, []);

    if (!isMounted) { // If the component is not mounted, return null.
        return null; // return null in server side rendering because hydration error can occur
    }

    return (
        <div className="flex items-center justify-center flex-col space-y-4 w-full">
            <CldUploadButton
                onUpload={(result: any) => onChange(result.info.secure_url)}
                options={{
                    maxFiles: 1,
                }}
                uploadPreset="gnit23to"
            >
                <div className="flex flex-col items-center justify-center space-y-2 hover:opacity-80 rounded-lg p-4 transition border-dashed border-4 border-primary/10">
                    <div className="relative h-40 w-40">
                        <Image src={value || "/placeholder.svg"} alt={"Upload"} fill className="object-cover rounded-lg" />
                    </div>
                </div>
            </CldUploadButton>
        </div>
    );
}
export default ImageUpload;

// hydration error: next.js encountered an error when trying to hydrate the app. Hydrate is the process of converting static HTML into a fully interactive app. For example, when a user navigates to a new page, the app is hydrated with the new page's content. This error occurs when the app is unable to hydrate due to a mismatch between the server-rendered HTML and the client-side JavaScript.