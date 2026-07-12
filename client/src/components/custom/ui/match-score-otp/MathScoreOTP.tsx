import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';

export type MatchScoreOTPProps<T extends FieldValues> = {
    label: string;
    control: Control<T>;
    name: ControllerProps<T>['name'];
    rules?: ControllerProps<T>['rules'];
} & {
    [key: string]: any;
};

export function MatchScoreOTP<T extends FieldValues>({ label, control, name, rules }: MatchScoreOTPProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const isInvalid = !!error;

                return (
                    <Field data-invalid={isInvalid}>
                        <FieldLabel>{label}</FieldLabel>

                        <InputOTP
                            maxLength={4}
                            onChange={onChange}
                            value={value}
                            containerClassName="flex justify-between w-full">
                            <InputOTPGroup>
                                <InputOTPSlot index={0} aria-invalid={isInvalid} className="min-w-20" />
                                <InputOTPSlot index={1} aria-invalid={isInvalid} className="min-w-20" />
                            </InputOTPGroup>

                            <InputOTPSeparator className="text-muted" />

                            <InputOTPGroup>
                                <InputOTPSlot index={2} aria-invalid={isInvalid} className="min-w-20" />
                                <InputOTPSlot index={3} aria-invalid={isInvalid} className="min-w-20" />
                            </InputOTPGroup>
                        </InputOTP>

                        <FieldError>{error?.message}</FieldError>
                    </Field>
                );
            }}
        />
    );
}
