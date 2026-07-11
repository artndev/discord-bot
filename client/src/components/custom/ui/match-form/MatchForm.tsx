'use client';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { PlusIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { CountrySelector } from '../country-selector';
import { MatchScoreOTP } from '../match-score-otp/MathScoreOTP';

interface MatchFormProps {
    onSubmit: () => void;
}

export function MatchForm() {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            firstCountry: '',
            secondCountry: '',
            score: '',
        },
    });

    const onSubmit = useCallback<(data: { firstCountry: string; secondCountry: string; score: string }) => void>(
        (data) => {
            const { score, ...args } = data;
            const firstCountryScore = score.slice(0, 2);
            const secondCountryScore = score.slice(2, 4);

            console.log({
                firstCountryScore,
                secondCountryScore,
                ...args,
            });
        },
        [],
    );

    return (
        <div className="flex-1">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <PlusIcon />
                        Add
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    style={{
                        minWidth: 500,
                    }}>
                    <SheetHeader>
                        <SheetTitle>Register Match</SheetTitle>
                        <SheetDescription>Write details for this instance.</SheetDescription>
                    </SheetHeader>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6 size-full"
                        style={{
                            paddingLeft: 24,
                            paddingRight: 24,
                            paddingBottom: 24,
                        }}>
                        <div className="flex-1 flex flex-col gap-6 h-full">
                            <FieldGroup className="flex-row">
                                <CountrySelector
                                    label="First country"
                                    control={control}
                                    name="firstCountry"
                                    rules={{
                                        required: 'First country is required',
                                    }}
                                />

                                <CountrySelector
                                    label="Second country"
                                    control={control}
                                    name="secondCountry"
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
        </div>
    );
}
