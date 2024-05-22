"use client";

import React, {ChangeEventHandler, useEffect, useState} from 'react';
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useRouter, useSearchParams} from "next/navigation";
import {useDebounce} from "@/hooks/UseDebounce";
import qs from "query-string";

const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams() // localhost:3000/?search=hello

    const categoryId = searchParams.get("categoryId"); // localhost:3000/?categoryId=1
    const name = searchParams.get("name");

    const [value, setValue] = useState(name || "");
    const debouncedValue = useDebounce<string>(value, 600); // Debounce the value of the input field. <string> is the generic type of the value that will be debounced.

    const onSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setValue(event.target.value);
    }

    // http://localhost:3000/?categoryId=2&name=ysk
    useEffect(() => {
        const query = {
            name: debouncedValue,
            categoryId,
        }
        const url = qs.stringifyUrl({ // Serialize the query object to a URL string. Qs is a library that provides a way of serializing JavaScript objects to query strings.
            url: window.location.href,
            query,
        }, {skipEmptyString: true, skipNull: true});
        router.push(url); // Update the URL with the new query string.

    }, [debouncedValue, router, categoryId]);
    // this useEffect will run every time the debouncedValue or categoryId changes. It will update the URL with the new query string.

    return (
        <div className="relative">
            <Search className={"absolute text-muted-foreground h-4 w-4 top-3 left-4"} />
            <Input
                placeholder="Search..."
                onChange={onSearchChange}
                value={value}
                className="bg-primary/10 pl-10"
            />
        </div>
    );
};

export default SearchInput;
