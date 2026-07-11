import { Skeleton } from '@/components/ui/skeleton';
import { BREAKPOINT_COLUMNS, Masonry } from '@/lib/masonry-grid';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSX, useEffect, useId, useMemo } from 'react';
import { FormProvider, Path, SubmitHandler, useForm } from 'react-hook-form';
import z, { ZodFirstPartyTypeKind, ZodObject } from 'zod';
import { ConfirmationBar } from '../confirmation-bar';
import { Setting } from './setting/Setting';

export interface SettingsProps<T extends ZodObject<any>> {
    schema: T;
    onSubmit: SubmitHandler<z.infer<T>>;
    defaultValues?: z.infer<T>;
    descriptions?: { [K in keyof z.infer<T>]?: string };
}

export interface SettingsSkeletonProps extends React.ComponentProps<'div'> {}

function SettingsComponent<T extends ZodObject<any>>({
    schema,
    onSubmit,
    defaultValues,
    descriptions,
}: SettingsProps<T>) {
    const id = useId();
    const methods = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        defaultValues: defaultValues as any,
    });

    const items = useMemo(() => {
        const getBaseSchema = (s: any): any => {
            if (!s || !s._def) return null;
            if (s._def.innerType) return getBaseSchema(s._def.innerType);
            if (s._def.typeName === ZodFirstPartyTypeKind.ZodArray) return getBaseSchema(s._def.type);
            if (s._def.schema) return getBaseSchema(s._def.schema);
            return s;
        };

        const getIsArray = (s: any): boolean => {
            if (!s || !s._def) return false;
            if (s._def.typeName === ZodFirstPartyTypeKind.ZodArray) return true;
            if (s._def.innerType) return getIsArray(s._def.innerType);
            if (s._def.schema) return getIsArray(s._def.schema);
            return false;
        };

        return Object.entries(schema.shape)
            .map(([key, val]) => {
                const baseSchema = getBaseSchema(val);
                const isArray = getIsArray(val);

                if (!baseSchema || !baseSchema._def) {
                    return null;
                }

                return {
                    key,
                    val,
                    baseSchema,
                    isArray,
                    typedKey: key as Path<z.infer<T>>,
                    description: descriptions?.[key],
                };
            })
            .filter(Boolean);
    }, [schema]);

    const MasonryCard = ({ data }: { data: any }) => {
        const { typedKey, baseSchema, isArray, description } = data;
        const typeName = baseSchema._def.typeName;
        const options = baseSchema._def?.values ?? [];

        if (typeName === ZodFirstPartyTypeKind.ZodString) {
            return <Setting.Text name={typedKey} control={methods.control} description={description} />;
        } else if (typeName === ZodFirstPartyTypeKind.ZodBoolean) {
            return <Setting.Boolean name={typedKey} control={methods.control} description={description} />;
        } else if (typeName === ZodFirstPartyTypeKind.ZodEnum) {
            return (
                <Setting.Variants
                    name={typedKey}
                    control={methods.control}
                    variants={options}
                    multiselect={isArray}
                    description={description}
                />
            );
        }

        return null;
    };

    useEffect(() => {
        methods.reset(defaultValues);
    }, [methods.reset, defaultValues]);

    return (
        <FormProvider {...methods}>
            <form className="flex-1" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <Masonry
                            breakpointCols={BREAKPOINT_COLUMNS}
                            className="flex gap-6"
                            columnClassName="flex flex-col gap-6">
                            {items.map((data: any, i) => {
                                return <MasonryCard key={`setting-${id}-${i}`} data={data} />;
                            })}
                        </Masonry>
                    </div>
                </div>

                <ConfirmationBar defaultValues={defaultValues as any} />
            </form>
        </FormProvider>
    );
}

export function SettingsSkeletonComponent({ className, ...props }: SettingsSkeletonProps) {
    const id = useId();

    return (
        <div className="flex-1 flex sm:flex-row flex-col gap-6">
            {new Array(2).fill(null).map((_, i) => {
                return (
                    <Skeleton
                        key={`settings-skeleton-${id}-${i}`}
                        className={cn('sm:flex-1 sm:max-w-96 w-full h-62.5 rounded-4xl', className)}
                        {...props}
                    />
                );
            })}
        </div>
    );
}

export type SettingsComponentType = {
    <T extends ZodObject<any>>(props: SettingsProps<T>): JSX.Element;
    displayName: string;
    Skeleton: typeof SettingsSkeletonComponent & { displayName: string };
};

export const Settings = Object.assign(SettingsComponent, {
    displayName: 'Settings',
    Skeleton: Object.assign(SettingsSkeletonComponent, {
        displayName: 'SettingsSkeleton',
    }),
});
