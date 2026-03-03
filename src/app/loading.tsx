import { Skeleton, OrderSkeleton } from '@/components/Skeleton/Skeleton';

export default function Loading() {
    return (
        <div className="dashboard-container" style={{ padding: '20px' }}>
            <div className="dash-mobile">
                <Skeleton width="150px" height="30px" style={{ marginBottom: '20px' }} />
                <OrderSkeleton />
                <OrderSkeleton />
                <OrderSkeleton />
            </div>
            <div className="dash-desktop">
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ flex: 3 }}>
                        <Skeleton width="200px" height="40px" style={{ marginBottom: '2rem' }} />
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Skeleton height="300px" />
                    </div>
                </div>
            </div>
        </div>
    );
}
