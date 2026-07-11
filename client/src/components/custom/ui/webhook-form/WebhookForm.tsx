'use client';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { WEBHOOK_URL_REGEX } from '@shared/constants';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '../input-field';

export interface MatchFormProps {
    defaultValues?: { webhookUrl: string };
    onSubmit?: (data: { webhookUrl: string }) => void;
}

export function WebhookForm({ defaultValues = { webhookUrl: '' }, onSubmit }: MatchFormProps) {
    const { control, handleSubmit, reset } = useForm({
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <div className="flex-1">
            <form
                onSubmit={handleSubmit((data) => onSubmit?.(data))}
                className="flex flex-col items-start gap-3 max-w-125">
                <FieldGroup className="flex-row">
                    <InputField
                        label="Webhook URL"
                        control={control}
                        name="webhookUrl"
                        rules={{
                            required: 'Webhook URL is required',
                            pattern: {
                                value: new RegExp(WEBHOOK_URL_REGEX),
                                message: 'Please enter a valid Discord webhook URL',
                            },
                        }}
                    />
                </FieldGroup>

                <Button type="submit" className="min-w-25">
                    Set up
                </Button>
            </form>
        </div>
    );
}
