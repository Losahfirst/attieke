'use client';
import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from './Skeleton/Skeleton';

interface ProgressiveImageProps extends ImageProps {
    containerClassName?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    alt,
    containerClassName = '',
    ...props
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={`progressive-image-container ${containerClassName}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                width: props.fill ? '100%' : 'auto',
                height: props.fill ? '100%' : 'auto'
            }}
        >
            <Image
                {...props}
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                style={{
                    ...props.style,
                    display: 'block'
                }}
            />
            {!loaded && (
                <Skeleton
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        background: 'rgba(255, 255, 255, 0.05)'
                    }}
                />
            )}
        </div>
    );
};
