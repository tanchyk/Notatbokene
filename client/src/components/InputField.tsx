import React, {InputHTMLAttributes} from "react";
import {useField} from "formik";
import {FormControl, FormErrorMessage, FormLabel, Input, Textarea} from "@chakra-ui/react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    textarea?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({label, textarea, size: _, ...props}) => {
    const [field, {error}] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            {
                textarea ? (
                    <Textarea
                        {...field}
                        id={field.name}
                        placeholder={props.placeholder}
                    />
                ) : (
                    <Input
                        {...field}
                        {...props}
                        id={field.name}
                        placeholder={props.placeholder}
                    />
                )
            }
            {!!error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}