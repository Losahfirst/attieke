import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height, circle, style }) => {
    const combinedStyle: React.CSSProperties = {
        width: width,
        height: height,
        borderRadius: circle ? '50%' : undefined,
        ...style,
    };

    return <div className={`skeleton ${className}`} style={combinedStyle} />;
};

export const OrderSkeleton = () => (
    <div className="skeleton-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton width="80px" height="20px" />
            <Skeleton width="100px" height="24px" className="skeleton-pill" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width="100%" height="16px" />
            <Skeleton width="80%" height="16px" />
        </div>
        <div style={{ height: '4px', width: '100%', borderRadius: '2px' }} className="skeleton" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <Skeleton width="60px" height="14px" />
            <Skeleton width="70px" height="14px" />
        </div>
    </div>
);

export const ProfileSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
        <Skeleton width="100px" height="100px" circle />
        <div style={{ width: '100%', maxWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Skeleton width="150px" height="24px" />
            <Skeleton width="120px" height="16px" />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Skeleton width="100%" height="45px" />
            <Skeleton width="100%" height="45px" />
            <Skeleton width="100%" height="45px" />
        </div>
    </div>
);

export const SectionSkeleton = () => (
    <div style={{ padding: '1rem' }}>
        <Skeleton width="60%" height="28px" className="skeleton-title" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Skeleton height="150px" className="skeleton-image" />
            <Skeleton height="150px" className="skeleton-image" />
        </div>
    </div>
);
