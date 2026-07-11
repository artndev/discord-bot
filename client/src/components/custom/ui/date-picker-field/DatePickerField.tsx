import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';
import { DatePicker } from '../date-picker/DatePicker';

export type DatePickerFieldProps<T extends FieldValues> = {
    label: string;
    control: Control<T>;
    name: ControllerProps<T>['name'];
    rules?: ControllerProps<T>['rules'];
} & {
    [key: string]: any;
};

export function DatePickerField<T extends FieldValues>({ label, control, name, rules }: DatePickerFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const isInvalid = !!error;

                console.log(value);

                return (
                    <Field
                        data-invalid={isInvalid}
                        style={{
                            flex: 1,
                            width: 'min-content',
                            minWidth: 0,
                        }}>
                        <FieldLabel>{label}</FieldLabel>

                        <DatePicker
                            value={!isNaN(new Date(value).getTime()) ? new Date(value) : undefined}
                            onChange={(val) => onChange(val?.toISOString())}
                        />

                        <FieldError>{error?.message}</FieldError>
                    </Field>
                );
            }}
        />
    );
}
