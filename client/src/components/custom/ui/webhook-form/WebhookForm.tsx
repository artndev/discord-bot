'use client';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { WEBHOOK_URL_REGEX } from '@shared/constants';
import { Check, Trash } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '../input-field';
import { validateDiscordWebhook } from './actions';

export interface MatchFormProps {
    defaultValues?: { webhookUrl?: string };
    onSubmit?: (data: { webhookUrl?: string | null }) => void;
}

export function WebhookForm({ defaultValues = { webhookUrl: '' }, onSubmit }: MatchFormProps) {
    const { control, handleSubmit, reset, setError, setValue } = useForm({
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const handleOnSubmit = useCallback<(data: { webhookUrl?: string }) => Promise<void>>(
        async (data) => {
            const { webhookUrl } = data;

            if (webhookUrl) {
                const validation = await validateDiscordWebhook(webhookUrl);

                if (!validation.ok) {
                    setError('webhookUrl', {
                        type: 'manual',
                        message: validation.err ?? 'Invalid webhook URL',
                    });

                    return;
                }
            }

            await onSubmit?.(data);
        },
        [onSubmit, setError],
    );

    const handleRemove = useCallback(() => {
        setValue('webhookUrl', '');

        onSubmit?.({ webhookUrl: null });
    }, [setValue, onSubmit]);

    return (
        <div className="flex-1">
            <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col items-start gap-3 max-w-125">
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

                <div className="flex items-center gap-3">
                    <Button type="submit" className="min-w-25">
                        <Check />
                        Set up
                    </Button>

                    <Button variant="destructive" type="button" className="min-w-25" onClick={handleRemove}>
                        <Trash />
                        Remove
                    </Button>
                </div>
            </form>
        </div>
    );
}
