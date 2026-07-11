import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useId } from 'react';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';

export interface SettingProps<T extends FieldValues> {
    control: Control<T>;
    name: ControllerProps<T>['name'];
    rules?: ControllerProps<T>['rules'];
}

function SettingComponent() {
    return null;
}

function SettingBooleanComponent<T extends FieldValues>({ control, name, rules }: SettingProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                return (
                    <Card className="w-[calc(100%-10px)] h-min ml-1.25 mt-1.25">
                        <CardHeader>
                            <CardTitle>{name}</CardTitle>

                            <CardDescription>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ab facere vel incidunt,
                                placeat dolor assumenda at quas possimus facilis totam tempore aspernatur quidem magni
                                optio atque ipsam maxime aut?
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Switch onCheckedChange={onChange} checked={value} />
                        </CardContent>
                    </Card>
                );
            }}
        />
    );
}

function SettingTextComponent<T extends FieldValues>({ control, name, rules }: SettingProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                return (
                    <Card className="w-[calc(100%-10px)] h-min ml-1.25 mt-1.25">
                        <CardHeader>
                            <CardTitle>{name}</CardTitle>

                            <CardDescription>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ab facere vel incidunt,
                                placeat dolor assumenda at quas possimus facilis totam tempore aspernatur quidem magni
                                optio atque ipsam maxime aut?
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Input onChange={onChange} value={value} />
                        </CardContent>
                    </Card>
                );
            }}
        />
    );
}

function SettingVariantsComponent<T extends FieldValues>({
    control,
    name,
    rules,
    variants,
    multiselect = false,
}: SettingProps<T> & { variants: readonly string[]; multiselect?: boolean }) {
    const id = useId();

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const safeValue = multiselect ? (Array.isArray(value) ? value : ([] as any[])) : value;

                return (
                    <Card className="w-[calc(100%-10px)] h-min ml-1.25 mt-1.25">
                        <CardHeader>
                            <CardTitle>{name}</CardTitle>

                            <CardDescription>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ab facere vel incidunt,
                                placeat dolor assumenda at quas possimus facilis totam tempore aspernatur quidem magni
                                optio atque ipsam maxime aut?
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center flex-wrap gap-3">
                                {variants.map((val, i) => {
                                    if (multiselect) {
                                        const isIncluded = safeValue.includes(val);

                                        return (
                                            <Button
                                                type="button"
                                                key={`setting-variants-${id}-${i}`}
                                                variant={isIncluded ? 'default' : 'outline'}
                                                onClick={() => {
                                                    if (!isIncluded) {
                                                        onChange([...safeValue, val]);

                                                        return;
                                                    }

                                                    onChange(
                                                        safeValue.filter((val2) => {
                                                            return val2 !== val;
                                                        }),
                                                    );
                                                }}>
                                                {val}
                                            </Button>
                                        );
                                    }

                                    return (
                                        <Button
                                            type="button"
                                            key={`setting-variants-${id}-${i}`}
                                            variant={value === val ? 'default' : 'outline'}
                                            onClick={() => onChange(val)}>
                                            {val}
                                        </Button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                );
            }}
        />
    );
}

export type SettingComponentType = {
    (): null;
    displayName: string;
    Boolean: typeof SettingBooleanComponent & { displayName: string };
    Text: typeof SettingTextComponent & { displayName: string };
    Variants: typeof SettingVariantsComponent & { displayName: string };
};

export const Setting = Object.assign(SettingComponent, {
    displayName: 'Setting',
    Boolean: Object.assign(SettingBooleanComponent, {
        displayName: 'SettingBoolean',
    }),
    Text: Object.assign(SettingTextComponent, {
        displayName: 'SettingText',
    }),
    Variants: Object.assign(SettingVariantsComponent, {
        displayName: 'SettingVariants',
    }),
});
