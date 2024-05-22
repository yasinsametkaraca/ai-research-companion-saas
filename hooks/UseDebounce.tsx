import React from 'react';

// useDebounce hook to debounce the value of an input field. Debouncing is a programming practice used to ensure that time-consuming tasks do not fire so often, making it difficult to keep up with the user's input.
export function useDebounce<T>(value: T, delay?: number): T { // T is a generic type that represents the type of the value that will be debounced.
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
// Why do we need to use delay? The delay is the time in milliseconds that the hook will wait before updating the debounced value. If the value changes before the delay time has passed, the timer will be reset. This is useful when you want to wait for the user to stop typing before updating the debounced value. Also database queries, API calls, etc. can be expensive operations, so you want to make sure you don't make them too often.