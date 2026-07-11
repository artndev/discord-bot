'use client';

import Image from 'next/image';
import { RefAttributes, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';

export type BongoCatMethods = {
    tap: () => void;
};

export interface BongoCatProps extends RefAttributes<BongoCatMethods> {
    width: number;
    height: number;
}

export function BongoCat({ ref, width, height }: BongoCatProps) {
    const [paw, setPaw] = useState<'idle' | 'left' | 'right'>('idle');
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    const tap = useCallback(() => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        setPaw((prev) => {
            return prev === 'left' ? 'right' : 'left';
        });

        timeoutId.current = setTimeout(() => {
            setPaw('idle');
        }, 2000);
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            tap,
        }),
        [tap],
    );

    const src = useMemo(() => {
        if (paw === 'left') {
            return '/assets/bongo-cat/bongo-left.png';
        } else if (paw === 'right') {
            return '/assets/bongo-cat/bongo-right.png';
        }

        return '/assets/bongo-cat/bongo-idle.png';
    }, [paw]);

    return (
        <div className="cursor-pointer select-none" onClick={tap}>
            <Image src={src} alt="bongo-cat" width={width} height={height} />
        </div>
    );
}
