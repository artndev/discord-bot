import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';

export type InputFieldProps<T extends FieldValues> = {
    label: string;
    control: Control<T>;
    name: ControllerProps<T>['name'];
    rules?: ControllerProps<T>['rules'];
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function InputField<T extends FieldValues>({ label, control, name, rules, ...props }: InputFieldProps<T>) {
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

                        <Input {...props} value={value} onChange={onChange} />

                        <FieldError>{error?.message}</FieldError>
                    </Field>
                );
            }}
        />
    );
}
