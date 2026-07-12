'use client';

import { createContext, useContext } from 'react';
import { FieldValues } from 'react-hook-form';

export type DefaultValuesContextType<T extends FieldValues> = {
    defaultValues?: T;
} & {
    [key: string]: any;
};

export interface DefaultValuesProviderProps<T extends FieldValues> extends DefaultValuesContextType<T> {
    children: React.ReactNode;
}

export const DefaultValuesContext = createContext<DefaultValuesContextType<any> | null>(null);

export const DefaultValuesProvider = <T extends FieldValues>({ children, ...props }: DefaultValuesProviderProps<T>) => {
    return <DefaultValuesContext.Provider value={props}>{children}</DefaultValuesContext.Provider>;
};

export const useDefaultValues = <T extends FieldValues = FieldValues>() => {
    const context = useContext(DefaultValuesContext) as DefaultValuesContextType<T> | null;
    if (!context) {
        console.warn('[DefaultValuesContext] useDefaultValues must be used within an DefaultValuesProvider');
    }

    return context;
};
