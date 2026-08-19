import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, PackageCheck, RefreshCw, X } from 'lucide-react';
import {
    cancelOrder,
    getMyOrders,
    updateSellerDecision,
    type OrderRecord,
    type OrderStatus,
} from './api';

const statusClass: Record<OrderStatus, string> = {
    requested: 'bg-[#EAF2FF] text-[#1D4ED8]',
    seller_accepted: 'bg-[#EAF4EE] text-[#14532D]',
    seller_rejected: 'bg-[#FEE2E2] text-[#991B1B]',
    admin_review: 'bg-[#FFF3D6] text-[#7C2D12]',
    pickup_assigned: 'bg-[#EDE9FE] text-[#6D28D9]',
    picked_up: 'bg-[#EDE9FE] text-[#6D28D9]',
    out_for_delivery: 'bg-[#EAF2FF] text-[#1D4ED8]',
    delivered: 'bg-[#EAF4EE] text-[#14532D]',
    cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
};

const canCancel = (status: OrderStatus) => !['delivered', 'cancelled', 'seller_rejected'].includes(status);

const getUserName = (user?: OrderRecord['buyer']) => user?.name || 'Boi Station reader';

const getStatusCopy = (order: OrderRecord, mode: 'buying' | 'selling') => {
    if (order.status === 'requested') return 'Waiting for seller';
    if (order.status === 'seller_accepted') return 'Seller accepted';
    if (order.status === 'seller_rejected') return 'Seller rejected';
    if (order.status === 'admin_review') {
        if (order.type === 'sell') return 'Order placed';
        return mode === 'selling' ? 'Exchange accepted' : 'Exchange request placed';
    }
    if (order.status === 'pickup_assigned') return 'Pickup assigned';
    if (order.status === 'picked_up') return 'Picked up from seller';
    if (order.status === 'out_for_delivery') return 'Delivery placed';
    if (order.status === 'delivered') return 'Delivered';
    return 'Cancelled';
};

const deliveryStepOrder: OrderStatus[] = ['admin_review', 'pickup_assigned', 'out_for_delivery'];

const shouldShowDeliverySteps = (status: OrderStatus) =>
    ['admin_review', 'pickup_assigned', 'picked_up', 'out_for_delivery'].includes(status);

const getDeliverySteps = (status: OrderStatus) => {
    const normalizedStatus = status === 'picked_up' ? 'pickup_assigned' : status;
    const currentIndex = deliveryStepOrder.indexOf(normalizedStatus);

    return [
        { label: 'Order placed', status: 'admin_review' as OrderStatus },
        { label: 'Pickup assigned', status: 'pickup_assigned' as OrderStatus },
        { label: 'Delivered', status: 'out_for_delivery' as OrderStatus },
    ].map((step, index) => ({
        ...step,
        isDone: currentIndex >= index,
        isActive: currentIndex === index,
    }));
};

const DeliverySteps = ({ status }: { status: OrderStatus }) => {
    if (!shouldShowDeliverySteps(status)) return null;

    const steps = getDeliverySteps(status);

    return (
        <div className="mt-4 rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]">Delivery progress</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {steps.map((step) => (
                    <div
                        className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-sm font-extrabold ${
                            step.isDone
                                ? 'border-[#A8EBC4] bg-[#E6F8EF] text-[#14532D]'
                                : 'border-[#E8DFD1] bg-white text-[#626B78]'
                        }`}
                        key={step.status}
                    >
                        <span
                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                                step.isDone ? 'bg-[#74E0A3] text-[#111827]' : 'bg-[#F4EFE6] text-[#8A8175]'
                            }`}
                        >
                            {step.isDone ? <Check size={14} strokeWidth={2.6} /> : steps.indexOf(step) + 1}
                        </span>
                        <span className="min-w-0">{step.label}</span>
                        {step.isActive ? <span className="ml-auto text-[11px] uppercase tracking-[0.08em]">Now</span> : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderCard = ({
    mode,
    onChanged,
    order,
}: {
    mode: 'buying' | 'selling';
    onChanged: () => void;
    order: OrderRecord;
}) => {
    const [isBusy, setIsBusy] = useState(false);
    const [error, setError] = useState('');
    const post = order.bookPost;
    const counterparty = mode === 'buying' ? order.seller : order.buyer;
    const needsSellerDecision = mode === 'selling' && order.type === 'exchange' && order.status === 'requested';

    const runAction = async (action: () => Promise<unknown>) => {
        setIsBusy(true);
        setError('');
        try {
            await action();
            onChanged();
        } catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : 'Could not update this order.');
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <article className="rounded-lg border border-[#D6CCBA] bg-white p-4 shadow-[0_10px_28px_rgba(17,24,39,0.05)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass[order.status]}`}>
                            {getStatusCopy(order, mode)}
                        </span>
                        <span className="rounded-full bg-[#F4EFE6] px-3 py-1 text-xs font-extrabold uppercase text-[#626B78]">
                            {order.type}
                        </span>
                    </div>
                    <h2 className="font-sora mt-3 text-2xl font-extrabold text-[#111827]">{post?.title || 'Book post'}</h2>
                    <p className="mt-1 font-bold text-[#626B78]">{post?.author || 'Author not available'}</p>
                    <p className="mt-3 text-sm font-semibold text-[#626B78]">
                        {mode === 'buying' ? 'Seller' : 'Buyer'}: <span className="text-[#111827]">{getUserName(counterparty)}</span>
                    </p>
                </div>
                <Link
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#D6CCBA] px-4 py-2 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]"
                    to={`/books/${post?._id || post?.id}`}
                >
                    View post
                    <ArrowRight size={16} strokeWidth={2.4} />
                </Link>
            </div>

            {order.type === 'exchange' && order.buyerProposedBook && (
                <div className="mt-4 rounded-lg border border-[#E8DFD1] bg-[#FAF7EF] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]">Proposed book</p>
                    <h3 className="font-sora mt-2 text-lg font-extrabold text-[#111827]">{order.buyerProposedBook.title}</h3>
                    <p className="mt-1 text-sm font-bold text-[#626B78]">
                        {order.buyerProposedBook.author} · {order.buyerProposedBook.condition}
                    </p>
                    {order.buyerProposedBook.conditionNote ? (
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#626B78]">
                            {order.buyerProposedBook.conditionNote}
                        </p>
                    ) : null}
                    {order.buyerProposedBook.photos?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {order.buyerProposedBook.photos.map((photo, index) => (
                                <img
                                    className="h-16 w-16 rounded-lg border border-[#D6CCBA] object-cover"
                                    key={`${photo.url}-${index}`}
                                    src={photo.url}
                                    alt={`Proposed book ${index + 1}`}
                                />
                            ))}
                        </div>
                    ) : null}
                </div>
            )}

            <DeliverySteps status={order.status} />

            <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]">Delivery to buyer</p>
                    <p className="mt-2 font-bold text-[#111827]">
                        {order.buyerDeliveryInfo.upazila}, {order.buyerDeliveryInfo.district}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#626B78]">{order.buyerDeliveryInfo.area}</p>
                </div>
                {mode === 'selling' && (
                    <div className="rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]">Pickup from seller</p>
                        <p className="mt-2 font-bold text-[#111827]">
                            {order.sellerPickupInfo.upazila}, {order.sellerPickupInfo.district}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#626B78]">{order.sellerPickupInfo.area}</p>
                    </div>
                )}
            </div>

            {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

            <div className="mt-5 flex flex-wrap gap-3">
                {needsSellerDecision && (
                    <>
                        <button
                            className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937] disabled:opacity-60"
                            disabled={isBusy}
                            onClick={() => runAction(() => updateSellerDecision(order._id, { decision: 'accepted' }))}
                            type="button"
                        >
                            <Check size={17} strokeWidth={2.4} />
                            Accept exchange
                        </button>
                        <button
                            className="inline-flex items-center gap-2 rounded-full border border-[#D6CCBA] px-5 py-3 text-sm font-extrabold text-[#991B1B] transition hover:bg-[#FFF1F0] disabled:opacity-60"
                            disabled={isBusy}
                            onClick={() => runAction(() => updateSellerDecision(order._id, { decision: 'rejected' }))}
                            type="button"
                        >
                            <X size={17} strokeWidth={2.4} />
                            Reject
                        </button>
                    </>
                )}
                {canCancel(order.status) && (
                    <button
                        className="rounded-full border border-[#D6CCBA] px-5 py-3 text-sm font-extrabold text-[#4F5865] transition hover:bg-[#F4EFE6] disabled:opacity-60"
                        disabled={isBusy}
                        onClick={() => runAction(() => cancelOrder(order._id))}
                        type="button"
                    >
                        Cancel request
                    </button>
                )}
            </div>
        </article>
    );
};

const Orders = () => {
    const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying');
    const [buying, setBuying] = useState<OrderRecord[]>([]);
    const [selling, setSelling] = useState<OrderRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadOrders = () => {
        setIsLoading(true);
        setError('');
        getMyOrders()
            .then((response) => {
                setBuying(response.data.buying);
                setSelling(response.data.selling);
            })
            .catch((loadError) => {
                setError(loadError instanceof Error ? loadError.message : 'Could not load orders.');
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const activeOrders = activeTab === 'buying' ? buying : selling;

    return (
        <main className="min-h-screen bg-[#FAF7EF] px-4 py-10 text-[#111827] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-5 border-b border-[#D6CCBA] pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8A8175]">Order center</p>
                        <h1 className="font-sora mt-2 text-4xl font-extrabold text-[#111827]">Orders & Requests</h1>
                        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#626B78]">
                            Track book orders, exchange requests, and seller confirmations from one place.
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-white px-5 py-3 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]"
                        onClick={loadOrders}
                        type="button"
                    >
                        <RefreshCw size={17} strokeWidth={2.4} />
                        Refresh
                    </button>
                </div>

                <div className="mt-6 inline-flex rounded-full border border-[#D6CCBA] bg-white p-1 shadow-[0_8px_20px_rgba(17,24,39,0.05)]">
                    {[
                        ['buying', 'My Orders'],
                        ['selling', 'Requests for My Books'],
                    ].map(([value, label]) => (
                        <button
                            className={`rounded-full px-5 py-2 text-sm font-extrabold transition ${activeTab === value ? 'bg-[#111827] text-white' : 'text-[#626B78] hover:bg-[#F4EFE6]'}`}
                            key={value}
                            onClick={() => setActiveTab(value as 'buying' | 'selling')}
                            type="button"
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="mt-8 rounded-lg border border-[#D6CCBA] bg-white p-8 text-center font-bold text-[#626B78]">
                        Loading orders...
                    </div>
                ) : error ? (
                    <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-8 text-center font-bold text-red-700">
                        {error}
                    </div>
                ) : activeOrders.length ? (
                    <div className="mt-8 grid gap-5">
                        {activeOrders.map((order) => (
                            <OrderCard key={order._id} mode={activeTab} order={order} onChanged={loadOrders} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-lg border border-[#D6CCBA] bg-white p-10 text-center shadow-[0_10px_28px_rgba(17,24,39,0.04)]">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#EAF4EE] text-[#14532D]">
                            <PackageCheck size={26} strokeWidth={2.3} />
                        </div>
                        <h2 className="font-sora mt-5 text-2xl font-extrabold text-[#111827]">No orders here yet</h2>
                        <p className="mt-2 text-sm font-semibold text-[#626B78]">
                            {activeTab === 'buying'
                                ? 'Order a book or request an exchange to see it here.'
                                : 'Requests for your books will appear here.'}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Orders;
