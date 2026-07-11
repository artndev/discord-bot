'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getData } from 'country-list';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';

export type CountrySelectorProps<T extends FieldValues> = {
    label: string;
    control: Control<T>;
    name: ControllerProps<T>['name'];
    rules?: ControllerProps<T>['rules'];
} & {
    [key: string]: any;
};

const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => {
            return 127397 + char.charCodeAt(0);
        });

    return String.fromCodePoint(...codePoints);
};

export function CountrySelector<T extends FieldValues>({
    label,
    control,
    name,
    rules,
    ...props
}: CountrySelectorProps<T>) {
    const countries = getData();

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const isInvalid = !!error;

                return (
                    <Field
                        data-invalid={isInvalid}
                        style={{
                            flex: 1,
                            width: 'min-content',
                            minWidth: 0,
                        }}>
                        <FieldLabel>{label}</FieldLabel>

                        <Select {...props} onValueChange={onChange} value={value}>
                            <SelectTrigger aria-invalid={isInvalid}>
                                <SelectValue placeholder="Country" className="overflow-x-auto max-w-10!" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    {countries.map((country) => (
                                        <SelectItem key={country.code} value={country.name}>
                                            {getFlagEmoji(country.code)} {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <FieldError>{error?.message}</FieldError>
                    </Field>
                );
            }}
        />
    );
}
