import { Box } from "@chakra-ui/react";
import React from "react";

export interface WrapperProps {
    variant?: 'small' | 'regular';
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant="regular"}) => {
    return (
        <Box mx="auto" w={variant === 'regular' ? "70%" : "40%"}>
            {children}
        </Box>
    );
}