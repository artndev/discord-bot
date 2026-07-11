'use client';

import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DatePickerProps {
    value?: Date;
    onChange?: (value: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    data-empty={!value}
                    className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                    {value ? format(value, 'PPP') : <span>Pick a date</span>}
                    <ChevronDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    defaultMonth={value}
                    onSelect={(val) => {
                        onChange?.(val);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
