import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
    variant?: 'small' | 'regular';
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant="regular"}) => {
    return (
        <Box mx="auto" w={variant === 'regular' ? "80%" : "60%"}>
            {children}
        </Box>
    );
}