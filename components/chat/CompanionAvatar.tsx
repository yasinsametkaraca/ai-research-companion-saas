import React from 'react';
import {Avatar, AvatarImage} from "@/components/ui/avatar";

interface CompanionAvatarProps {
    source: string;
}

const CompanionAvatar = ({source}: CompanionAvatarProps) => {
    return (
        <Avatar className="w-12 h-12">
            <AvatarImage src={source} />
        </Avatar>
    );
};

export default CompanionAvatar;
