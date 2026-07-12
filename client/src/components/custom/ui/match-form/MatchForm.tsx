'use client';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useDefaultValues } from '@/contexts/DefaultValuesContext';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { PlusIcon } from 'lucide-react';
import React, { RefAttributes, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CountrySelector } from '../country-selector';
import { DatePickerField } from '../date-picker-field';
import { MatchScoreOTP } from '../match-score-otp/MathScoreOTP';

export type MatchFormValues = {
    first_country: string;
    second_country: string;
    score: string;
    date: string;
};

export type MatchFormValuesModified = Omit<MatchFormValues, 'score'> & {
    first_country_score: string;
    second_country_score: string;
};

export interface MatchFormMethods {
    open: () => void;
    close: () => void;
}

export interface MatchFormProps extends RefAttributes<MatchFormMethods> {
    onSubmit?: (data: MatchFormValuesModified) => void;
    renderTrigger?: () => React.ReactNode;
    withTrigger?: boolean;
}

export function MatchForm({ ref, renderTrigger, withTrigger = true, onSubmit }: MatchFormProps) {
    const {
        defaultValues = {
            first_country: '',
            second_country: '',
            score: '',
            date: '',
        },
    } = useDefaultValues<MatchFormValues>() || {};
    const { control, handleSubmit, setValues } = useForm({
        defaultValues,
    });
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useImperativeHandle(
        ref,
        () => ({
            open: () => {
                setIsOpen(true);
            },
            close: () => {
                setIsOpen(false);
            },
        }),
        [],
    );

    const handleOnSubmit = useCallback<(data: MatchFormValues) => void>(
        (data) => {
            const { score, ...args } = data;

            onSubmit?.({
                ...args,
                first_country_score: score.slice(0, 2),
                second_country_score: score.slice(2, 4),
            });
        },
        [onSubmit],
    );

    useEffect(() => {
        setValues(defaultValues);
    }, [defaultValues]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {withTrigger && (
                <SheetTrigger asChild>
                    {renderTrigger ? (
                        renderTrigger()
                    ) : (
                        <div className="fixed right-5 bottom-5">
                            <Button variant="secondary" className="size-12.5 rounded-full">
                                <PlusIcon />
                            </Button>
                        </div>
                    )}
                </SheetTrigger>
            )}

            <SheetContent
                side="right"
                style={{
                    minWidth: 'min(100%,500px)',
                }}>
                <SheetHeader>
                    <SheetTitle>Register Match</SheetTitle>
                    <SheetDescription>Write details for this instance.</SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-6 size-full px-6! pb-6!">
                    <div className="flex-1 flex flex-col gap-6 h-full">
                        <FieldGroup>
                            <DatePickerField
                                label="Date"
                                control={control}
                                name="date"
                                rules={{
                                    required: 'Date is required',
                                }}
                            />
                        </FieldGroup>

                        <FieldGroup className="flex-row">
                            <CountrySelector
                                label="First country"
                                control={control}
                                name="first_country"
                                rules={{
                                    required: 'First country is required',
                                }}
                            />

                            <CountrySelector
                                label="Second country"
                                control={control}
                                name="second_country"
                                rules={{
                                    required: 'Second country is required',
                                }}
                            />
                        </FieldGroup>

                        <FieldGroup>
                            <MatchScoreOTP
                                label="Score"
                                control={control}
                                name="score"
                                rules={{
                                    required: 'Score is required',
                                    minLength: { value: 4, message: 'Score must be exactly 4 digits' },
                                    pattern: {
                                        value: new RegExp(REGEXP_ONLY_DIGITS),
                                        message: 'Score must contain only digits',
                                    },
                                }}
                            />
                        </FieldGroup>
                    </div>

                    <Button type="submit">Register</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
