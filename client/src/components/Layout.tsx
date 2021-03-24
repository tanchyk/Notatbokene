import React from "react";
import {Wrapper, WrapperProps} from "./Wrapper";
import {Navbar} from "./Navbar";

export const Layout: React.FC<WrapperProps> = ({variant, children}) => {
    return (
        <>
            <Navbar />
            <Wrapper variant={variant}>
                {children}
            </Wrapper>
        </>
    );
}