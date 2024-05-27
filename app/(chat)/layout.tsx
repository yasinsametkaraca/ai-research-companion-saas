import React from 'react';

const ChatLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="mx-auto max-w-4xl w-full h-full">
            {children}
        </div>
    );
};

export default ChatLayout;
