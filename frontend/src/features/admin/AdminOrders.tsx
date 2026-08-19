import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, Copy, ShieldCheck, Truck } from 'lucide-react';
import { useMockAuth } from '../../hooks/useMockAuth';
import { getAdminOrders, updateAdminOrderStatus, type OrderRecord, type OrderStatus } from '../orders/api';

const adminStatuses: OrderStatus[] = [
    'admin_review',
    'pickup_assigned',
    'out_for_delivery',
    'delivered',
    'cancelled',
];

const statusLabel: Record<OrderStatus, string> = {
    requested: 'Waiting for seller',
    seller_accepted: 'Seller accepted',
    seller_rejected: 'Seller rejected',
    admin_review: 'Admin review',
    pickup_assigned: 'Pickup assigned',
    picked_up: 'Picked up',
    out_for_delivery: 'Delivery placed',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

type AdminDraft = {
    status: OrderStatus;
    adminNote: string;
    agentName: string;
    agentPhone: string;
};

type CopyableValue = {
    id: string;
    label: string;
    value?: string;
};

const formatContactForCopy = (label: string, info: OrderRecord['buyerDeliveryInfo']) =>
    `${label}
Name: ${info.contactName}
Phone: ${info.phone}
Division: ${info.division}
District: ${info.district}
Upazila/Thana: ${info.upazila}
Area/Landmark: ${info.area}
Address: ${info.address}${info.note ? `
Note: ${info.note}` : ''}`;

const buildContactRows = (prefix: string, info: OrderRecord['buyerDeliveryInfo']): CopyableValue[] => [
    { id: `${prefix}-name`, label: 'Contact name', value: info.contactName },
    { id: `${prefix}-phone`, label: 'Phone', value: info.phone },
    { id: `${prefix}-division`, label: 'Division', value: info.division },
    { id: `${prefix}-district`, label: 'District', value: info.district },
    { id: `${prefix}-upazila`, label: 'Upazila / Thana', value: info.upazila },
    { id: `${prefix}-area`, label: 'Area / Landmark', value: info.area },
    { id: `${prefix}-address`, label: 'Full address', value: info.address },
    { id: `${prefix}-note`, label: 'Note', value: info.note },
];

const copyButtonClass =
    'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D6CCBA] px-3 py-1.5 text-xs font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]';

const InfoRow = ({
    copied,
    item,
    onCopy,
}: {
    copied: string;
    item: CopyableValue;
    onCopy: (id: string, text: string) => void;
}) => {
    const value = item.value?.trim() || 'Not provided';
    const canCopy = Boolean(item.value?.trim());

    return (
        <div className="grid gap-2 rounded-lg border border-[#E8DFD1] bg-white px-3 py-3 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8A8175]">{item.label}</p>
            <p className="min-w-0 break-words text-sm font-bold leading-6 text-[#111827]">{value}</p>
            <button
                className={`${copyButtonClass} justify-center disabled:cursor-not-allowed disabled:opacity-45`}
                disabled={!canCopy}
                onClick={() => onCopy(item.id, value)}
                type="button"
            >
                <Copy size={13} strokeWidth={2.4} />
                {copied === item.id ? 'Copied' : 'Copy'}
            </button>
        </div>
    );
};

const DetailSection = ({
    copied,
    copyAllId,
    copyAllText,
    isOpen,
    onCopy,
    onToggle,
    rows,
    title,
}: {
    copied: string;
    copyAllId: string;
    copyAllText: string;
    isOpen: boolean;
    onCopy: (id: string, text: string) => void;
    onToggle: () => void;
    rows: CopyableValue[];
    title: string;
}) => (
    <section className="rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
                className="inline-flex items-center gap-2 text-left text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]"
                onClick={onToggle}
                type="button"
            >
                <ChevronDown
                    className={`transition ${isOpen ? 'rotate-180' : ''}`}
                    size={16}
                    strokeWidth={2.5}
                />
                {title}
            </button>
            <div className="flex flex-wrap gap-2">
                <button className={`${copyButtonClass} justify-center`} onClick={() => onCopy(copyAllId, copyAllText)} type="button">
                    <Copy size={13} strokeWidth={2.4} />
                    {copied === copyAllId ? 'Copied all' : 'Copy all'}
                </button>
                <button
                    className="rounded-full border border-[#D6CCBA] px-3 py-1.5 text-xs font-extrabold text-[#626B78] transition hover:bg-[#F4EFE6]"
                    onClick={onToggle}
                    type="button"
                >
                    {isOpen ? 'Hide details' : 'View details'}
                </button>
            </div>
        </div>
        {isOpen && (
            <div className="mt-4 grid gap-2">
                {rows.map((item) => (
                    <InfoRow copied={copied} item={item} key={item.id} onCopy={onCopy} />
                ))}
            </div>
        )}
    </section>
);

const SummaryBox = ({
    copied,
    location,
    name,
    onCopy,
    phone,
    title,
}: {
    copied: string;
    location: string;
    name?: string;
    onCopy: (id: string, text: string) => void;
    phone?: string;
    title: string;
}) => (
    <div className="rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]">{title}</p>
        <p className="mt-2 min-w-0 break-words font-bold text-[#111827]">{name || 'Not provided'}</p>
        <p className="mt-1 min-w-0 break-words text-sm font-semibold leading-6 text-[#626B78]">{location}</p>
        <div className="mt-3 flex flex-wrap gap-2">
            <button
                className={copyButtonClass}
                disabled={!phone}
                onClick={() => onCopy(`${title}-phone-${phone}`, phone || '')}
                type="button"
            >
                <Copy size={13} strokeWidth={2.4} />
                {copied === `${title}-phone-${phone}` ? 'Copied phone' : 'Copy phone'}
            </button>
            <button
                className={copyButtonClass}
                onClick={() => onCopy(`${title}-location-${location}`, location)}
                type="button"
            >
                <Copy size={13} strokeWidth={2.4} />
                {copied === `${title}-location-${location}` ? 'Copied area' : 'Copy area'}
            </button>
        </div>
    </div>
);

const OrderAdminCard = ({ onChanged, order }: { onChanged: (order: OrderRecord) => void; order: OrderRecord }) => {
    const [draft, setDraft] = useState<AdminDraft>({
        status: order.status === 'requested' || order.status === 'seller_accepted' || order.status === 'seller_rejected'
            ? 'admin_review'
            : order.status,
        adminNote: order.adminNote || '',
        agentName: order.deliveryAgent?.name || '',
        agentPhone: order.deliveryAgent?.phone || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState('');
    const [success, setSuccess] = useState('');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const copyInfo = async (label: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);
            window.setTimeout(() => setCopied(''), 1400);
        } catch {
            setError('Could not copy this information.');
        }
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');
        try {
            const response = await updateAdminOrderStatus(order._id, {
                status: draft.status,
                adminNote: draft.adminNote,
                deliveryAgent: {
                    name: draft.agentName,
                    phone: draft.agentPhone,
                },
            });
            onChanged(response.data);
            setSuccess(`${statusLabel[response.data.status]} saved. Buyer and seller can see this update.`);
        } catch (updateError) {
            setError(updateError instanceof Error ? updateError.message : 'Could not update this order.');
        } finally {
            setIsSaving(false);
        }
    };

    const orderInfoRows: CopyableValue[] = [
        { id: `order-${order._id}-id`, label: 'Order ID', value: order._id },
        { id: `order-${order._id}-short-id`, label: 'Short ID', value: order._id.slice(-8) },
        { id: `order-${order._id}-book`, label: 'Book title', value: order.bookPost?.title },
        { id: `order-${order._id}-author`, label: 'Book author', value: order.bookPost?.author },
        { id: `order-${order._id}-type`, label: 'Order type', value: order.type },
        { id: `order-${order._id}-status`, label: 'Current status', value: statusLabel[order.status] },
        { id: `order-${order._id}-seller`, label: 'Seller account', value: order.seller?.name },
        { id: `order-${order._id}-buyer`, label: 'Buyer account', value: order.buyer?.name },
    ];

    const pickupRows = buildContactRows(`pickup-${order._id}`, order.sellerPickupInfo);
    const deliveryRows = buildContactRows(`delivery-${order._id}`, order.buyerDeliveryInfo);
    const agentRows: CopyableValue[] = [
        { id: `agent-${order._id}-name`, label: 'Agent name', value: draft.agentName },
        { id: `agent-${order._id}-phone`, label: 'Agent phone', value: draft.agentPhone },
    ];
    const toggleSection = (section: string) => {
        setOpenSections((current) => ({ ...current, [section]: !current[section] }));
    };
    const pickupSummary = `${order.sellerPickupInfo.upazila}, ${order.sellerPickupInfo.district} · ${order.sellerPickupInfo.area}`;
    const deliverySummary = `${order.buyerDeliveryInfo.upazila}, ${order.buyerDeliveryInfo.district} · ${order.buyerDeliveryInfo.area}`;

    return (
        <article className="rounded-lg border border-[#D6CCBA] bg-white p-4 shadow-[0_10px_28px_rgba(17,24,39,0.05)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#EAF4EE] px-3 py-1 text-xs font-extrabold uppercase text-[#14532D]">
                            {order.type}
                        </span>
                        <span className="rounded-full bg-[#F4EFE6] px-3 py-1 text-xs font-extrabold text-[#626B78]">
                            {statusLabel[order.status]}
                        </span>
                    </div>
                    <h2 className="font-sora mt-3 text-2xl font-extrabold text-[#111827]">
                        {order.bookPost?.title || 'Book post'}
                    </h2>
                    <p className="mt-1 font-bold text-[#626B78]">{order.bookPost?.author}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-lg border border-[#E8DFD1] bg-[#FAF7EF] px-4 py-3 text-sm font-bold text-[#111827] sm:flex-row sm:items-center">
                    <span>Order ID: {order._id.slice(-8)}</span>
                    <button className={copyButtonClass} onClick={() => copyInfo(`header-order-${order._id}`, order._id)} type="button">
                        <Copy size={13} strokeWidth={2.4} />
                        {copied === `header-order-${order._id}` ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
                <SummaryBox
                    copied={copied}
                    location={pickupSummary}
                    name={order.sellerPickupInfo.contactName}
                    onCopy={copyInfo}
                    phone={order.sellerPickupInfo.phone}
                    title="Seller pickup"
                />
                <SummaryBox
                    copied={copied}
                    location={deliverySummary}
                    name={order.buyerDeliveryInfo.contactName}
                    onCopy={copyInfo}
                    phone={order.buyerDeliveryInfo.phone}
                    title="Buyer delivery"
                />
            </div>

            <div className="mt-3 grid gap-3">
                <DetailSection
                    copied={copied}
                    copyAllId={`order-all-${order._id}`}
                    copyAllText={orderInfoRows.map((item) => `${item.label}: ${item.value || 'Not provided'}`).join('\n')}
                    isOpen={Boolean(openSections.order)}
                    onCopy={copyInfo}
                    onToggle={() => toggleSection('order')}
                    rows={orderInfoRows}
                    title="Order & book information"
                />
                <DetailSection
                    copied={copied}
                    copyAllId={`pickup-all-${order._id}`}
                    copyAllText={formatContactForCopy('Seller pickup', order.sellerPickupInfo)}
                    isOpen={Boolean(openSections.pickup)}
                    onCopy={copyInfo}
                    onToggle={() => toggleSection('pickup')}
                    rows={pickupRows}
                    title="Seller pickup"
                />
                <DetailSection
                    copied={copied}
                    copyAllId={`delivery-all-${order._id}`}
                    copyAllText={formatContactForCopy('Buyer delivery', order.buyerDeliveryInfo)}
                    isOpen={Boolean(openSections.delivery)}
                    onCopy={copyInfo}
                    onToggle={() => toggleSection('delivery')}
                    rows={deliveryRows}
                    title="Buyer delivery"
                />
            </div>

            {order.buyerProposedBook ? (
                <div className="mt-3 rounded-lg border border-[#E8DFD1] bg-[#FAF7EF] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]">Exchange proposed book</p>
                    <p className="mt-2 font-bold text-[#111827]">
                        {order.buyerProposedBook.title} · {order.buyerProposedBook.condition}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#626B78]">{order.buyerProposedBook.author}</p>
                </div>
            ) : null}

            <section className="mt-3 rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A8175]">Delivery operation</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            className={copyButtonClass}
                            onClick={() => copyInfo(`agent-all-${order._id}`, agentRows.map((item) => `${item.label}: ${item.value || 'Not provided'}`).join('\n'))}
                            type="button"
                        >
                            <Copy size={13} strokeWidth={2.4} />
                            {copied === `agent-all-${order._id}` ? 'Copied all' : 'Copy agent info'}
                        </button>
                        <button
                            className="rounded-full border border-[#D6CCBA] px-3 py-1.5 text-xs font-extrabold text-[#626B78] transition hover:bg-[#F4EFE6]"
                            onClick={() => toggleSection('agent')}
                            type="button"
                        >
                            {openSections.agent ? 'Hide agent rows' : 'View agent rows'}
                        </button>
                    </div>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px_auto]">
                    <input
                        className="min-h-12 min-w-0 rounded-lg border border-[#D6CCBA] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
                        onChange={(event) => setDraft((current) => ({ ...current, agentName: event.target.value }))}
                        placeholder="Delivery agent name"
                        value={draft.agentName}
                    />
                    <input
                        className="min-h-12 min-w-0 rounded-lg border border-[#D6CCBA] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
                        onChange={(event) => setDraft((current) => ({ ...current, agentPhone: event.target.value }))}
                        placeholder="Agent phone"
                        value={draft.agentPhone}
                    />
                    <select
                        aria-label="Delivery status"
                        className="min-h-12 rounded-lg border border-[#D6CCBA] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
                        onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as OrderStatus }))}
                        value={draft.status}
                    >
                        {adminStatuses.map((status) => (
                            <option key={status} value={status}>{statusLabel[status]}</option>
                        ))}
                    </select>
                    <button
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937] disabled:opacity-60"
                        disabled={isSaving}
                        onClick={handleUpdate}
                        type="button"
                    >
                        <Truck size={17} strokeWidth={2.4} />
                        {isSaving ? 'Saving...' : 'Save Status'}
                    </button>
                </div>
                {openSections.agent && (
                    <div className="mt-3 grid gap-2">
                        {agentRows.map((item) => (
                            <InfoRow copied={copied} item={item} key={item.id} onCopy={copyInfo} />
                        ))}
                    </div>
                )}
                <textarea
                    className="mt-3 min-h-24 w-full resize-none rounded-lg border border-[#D6CCBA] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
                    onChange={(event) => setDraft((current) => ({ ...current, adminNote: event.target.value }))}
                    placeholder="Admin note"
                    value={draft.adminNote}
                />
            </section>
            {success ? (
                <p className="mt-3 flex items-start gap-2 rounded-lg border border-[#A8EBC4] bg-[#E6F8EF] px-4 py-3 text-sm font-bold text-[#14532D]">
                    <CheckCircle2 className="mt-0.5 shrink-0" size={17} strokeWidth={2.4} />
                    {success}
                </p>
            ) : null}
            {error ? <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
        </article>
    );
};

const AdminOrders = () => {
    const { currentUser } = useMockAuth();
    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadOrders = () => {
        setIsLoading(true);
        setError('');
        getAdminOrders()
            .then((response) => setOrders(response.data))
            .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Could not load admin orders.'))
            .finally(() => setIsLoading(false));
    };

    const handleOrderChanged = (updatedOrder: OrderRecord) => {
        setOrders((currentOrders) =>
            currentOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)),
        );
    };

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            loadOrders();
        } else {
            setIsLoading(false);
        }
    }, [currentUser?.role]);

    if (currentUser?.role !== 'admin') {
        return (
            <main className="min-h-screen bg-[#FAF7EF] px-4 py-12 text-[#111827]">
                <div className="mx-auto max-w-2xl rounded-lg border border-[#D6CCBA] bg-white p-8 text-center">
                    <ShieldCheck className="mx-auto text-[#8A8175]" size={34} strokeWidth={2.3} />
                    <h1 className="font-sora mt-4 text-3xl font-extrabold">Admin access required</h1>
                    <p className="mt-2 font-semibold text-[#626B78]">Only Boi Station admins can view delivery operations.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAF7EF] px-4 py-10 text-[#111827] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="border-b border-[#D6CCBA] pb-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8A8175]">Admin panel</p>
                    <h1 className="font-sora mt-2 text-4xl font-extrabold">Order Operations</h1>
                    <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#626B78]">
                        Review accepted requests, assign pickup, and move delivery status forward.
                    </p>
                </div>

                {isLoading ? (
                    <div className="mt-8 rounded-lg border border-[#D6CCBA] bg-white p-8 text-center font-bold text-[#626B78]">Loading admin queue...</div>
                ) : error ? (
                    <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-8 text-center font-bold text-red-700">{error}</div>
                ) : orders.length ? (
                    <div className="mt-8 grid gap-5">
                        {orders.map((order) => <OrderAdminCard key={order._id} order={order} onChanged={handleOrderChanged} />)}
                    </div>
                ) : (
                    <div className="mt-8 rounded-lg border border-[#D6CCBA] bg-white p-10 text-center font-bold text-[#626B78]">
                        No admin orders yet.
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminOrders;
