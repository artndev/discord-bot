import { Button } from '@/components/ui/button';
import { FieldValues, useFormContext, useFormState } from 'react-hook-form';

export interface ConfirmationBarProps {
    defaultValues: FieldValues;
}

export function ConfirmationBar({ defaultValues }: ConfirmationBarProps) {
    const { reset } = useFormContext();
    const { isDirty } = useFormState();

    if (!isDirty) {
        return null;
    }

    return (
        <div className="z-9999 fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg flex justify-center items-center gap-4 animate-in slide-in-from-bottom-10">
            <p>You have unsaved changes!</p>

            <Button variant="outline" onClick={() => reset(defaultValues)}>
                Cancel
            </Button>

            <Button type="submit">Save Changes</Button>
        </div>
    );
}
