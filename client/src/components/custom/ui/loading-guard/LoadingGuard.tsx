import { cn } from '@/lib/utils';
import { Hatch } from 'ldrs/react';
import 'ldrs/react/Hatch.css';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';

export interface LoadingGuardProps {
    isLoading?: boolean;
    bufferTime?: number;
    className?: string;
}

export function LoadingGuard({ isLoading = false, bufferTime = 1500, className }: LoadingGuardProps) {
    const id = useId();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        if (isLoading) {
            setIsMounted(true);

            return;
        }

        timeoutId.current = setTimeout(() => {
            setIsMounted(false);
        }, bufferTime);

        return () => {
            if (!timeoutId.current) {
                return;
            }

            clearTimeout(timeoutId.current);
        };
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isMounted && (
                <motion.div
                    key={`loading-guard-${id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                        'absolute z-9999 flex justify-center items-center size-full bg-[rgba(0,0,0,0.8)]',
                        className,
                    )}>
                    <Hatch size="28" stroke="4" speed="3.5" color="white" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
