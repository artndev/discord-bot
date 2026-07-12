import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'ldrs/react/Hatch.css';
import { RefreshCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId } from 'react';

export interface ErrorOverlayProps {
    isEnabled?: boolean;
    onRetry?: () => void;
    className?: string;
}

export function ErrorOverlay({ isEnabled = false, onRetry, className }: ErrorOverlayProps) {
    const id = useId();

    return (
        <AnimatePresence>
            {isEnabled && (
                <motion.div
                    key={`loading-guard-${id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                        'absolute z-9999 flex flex-col justify-center items-center gap-6 size-full bg-[rgba(0,0,0,0.8)]',
                        className,
                    )}>
                    <p className="text-4xl font-semibold">Oops! It seems you caught an error {':<'}</p>

                    <Button type="button" onClick={onRetry} className="min-w-50">
                        <RefreshCcw />
                        Retry
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
