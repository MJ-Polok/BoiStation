import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Bookmark,
    BookmarkCheck,
    BookOpen,
    ChevronRight,
    MapPin,
    MessageCircle,
    PackageCheck,
    Repeat2,
    Upload,
    X,
} from 'lucide-react';
import { createLoginRedirect } from '../../lib/auth';
import { useMockAuth } from '../../hooks/useMockAuth';
import { getBookPost, type BackendBookPost } from './api';
import { createConversation } from '../messages/api';
import { isBookSaved, removeSavedBook, saveBook } from '../saved/api';
import { createOrder, type ContactInfo } from '../orders/api';
import { uploadImages, type UploadedImage } from '../post/api';
import { divisions, getDistrictsForDivision, getUpazilasForDistrict } from '../../data/bangladeshLocations';

type GalleryItem = {
    id: string;
    label: string;
    type: 'cover' | 'photo' | 'exchange';
    imageUrl?: string;
    color?: string;
};

const fallbackPhotoColors = ['#EAF4EE', '#F4D35E', '#93C5FD', '#A78BFA'];

type BookDetailsPost = {
    id: string;
    type: 'sell' | 'exchange';
    status: 'active' | 'sold' | 'exchanged';
    book: {
        title: string;
        author: string;
        category: string;
        condition: string;
        officialCoverUrl?: string;
        fallbackCoverColor: string;
        officialDescription?: string;
        source: 'database' | 'manual';
    };
    wantedBook?: {
        title: string;
        author: string;
        officialCoverUrl?: string;
        fallbackCoverColor: string;
        source: 'database' | 'manual';
    };
    sellerPhotos: string[];
    photoColors: string[];
    price?: number;
    priceLabel?: string;
    negotiable?: boolean;
    location: string;
    sellerNote?: string;
    seller: {
        id: string;
        name: string;
        initials: string;
        avatarColor: string;
        area: string;
    };
    createdAt: string;
};

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'BS';

const formatPrice = (price?: number) => (typeof price === 'number' ? `৳${price}` : undefined);

const formatPostedDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Recently posted';
    }

    return date.toLocaleDateString('en-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const mapBackendBookToDetailsPost = (post: BackendBookPost): BookDetailsPost => {
    const ownerId = post.owner.username || post.owner.id || post.owner._id || 'reader';
    const ownerName = post.owner.name || 'Boi Station reader';
    const coverUrl = post.officialBook?.coverUrl || post.frontImage?.url;
    const status =
        post.status === 'sold' || post.status === 'exchanged'
            ? post.status
            : post.status === 'unavailable' && post.type === 'exchange'
                ? 'exchanged'
                : post.status === 'unavailable'
                    ? 'sold'
                    : 'active';

    return {
        id: post._id,
        type: post.type === 'exchange' ? 'exchange' : 'sell',
        status,
        book: {
            title: post.title,
            author: post.author,
            category: post.category,
            condition: post.condition,
            officialCoverUrl: coverUrl,
            fallbackCoverColor: '#F7F2E8',
            officialDescription: post.officialDescription || post.officialBook?.description,
            source: post.officialBook ? 'database' : 'manual',
        },
        wantedBook:
            post.type === 'exchange' && post.wantedBook
                ? {
                      title: post.wantedBook.title,
                      author: post.wantedBook.author || 'Open to offers',
                      officialCoverUrl: post.wantedBook.officialBook?.coverUrl || post.wantedBook.frontImage?.url,
                      fallbackCoverColor: '#EAF2FF',
                      source: post.wantedBook.officialBook ? 'database' : 'manual',
                  }
                : undefined,
        sellerPhotos: post.sellerImages?.map((image) => image.url) || [],
        photoColors: fallbackPhotoColors,
        price: post.price,
        priceLabel: formatPrice(post.price),
        negotiable: post.isNegotiable,
        location: post.location,
        sellerNote: post.sellerNote,
        seller: {
            id: ownerId,
            name: ownerName,
            initials: getInitials(ownerName),
            avatarColor: '#7DE3A5',
            area: post.owner.location || post.location,
        },
        createdAt: formatPostedDate(post.createdAt),
    };
};

const CoverVisual = ({
    author,
    color,
    imageUrl,
    title,
}: {
    author: string;
    color: string;
    imageUrl?: string;
    title: string;
}) => (
    <div className="mx-auto aspect-[4/5] w-[min(68vw,220px)] max-w-full overflow-hidden rounded-lg border-2 border-[#111827] bg-[#FFFDF8] shadow-[4px_4px_0_rgba(17,24,39,0.10)] sm:w-full sm:max-w-[280px] sm:shadow-[8px_8px_0_rgba(17,24,39,0.10)] lg:max-w-[320px]">
        {imageUrl ? (
            <img className="h-full w-full object-cover" src={imageUrl} alt={`${title} cover`} />
        ) : (
            <div className="flex h-full flex-col justify-between p-5" style={{ backgroundColor: color }}>
                <div>
                    <h3 className="font-sora line-clamp-5 text-xl font-extrabold leading-tight text-[#111827] sm:text-2xl">
                        {title}
                    </h3>
                    <p className="mt-3 text-sm font-bold text-[#4F5865]">{author}</p>
                </div>
                <BookOpen size={44} strokeWidth={1.8} />
            </div>
        )}
    </div>
);

const SellerPhotoVisual = ({ color, imageUrl, label }: { color: string; imageUrl?: string; label: string }) => (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-lg border-2 border-[#111827] bg-[#F7F4EC]">
        {imageUrl ? (
            <img className="h-full w-full object-cover" src={imageUrl} alt={label} />
        ) : (
            <div className="relative h-full w-full" style={{ backgroundColor: color }}>
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40" />
                <div className="absolute bottom-10 left-10 h-12 w-24 rounded-sm border-2 border-[#111827] bg-[#FFFDF8]" />
                <div className="absolute bottom-10 right-12 h-24 w-12 rounded-sm border-2 border-[#111827] bg-white/60" />
            </div>
        )}
    </div>
);

const ExchangeVisual = ({ post }: { post: BookDetailsPost }) => {
    const wantedBook = post.wantedBook;

    return (
        <div className="relative mx-auto min-h-[260px] w-full max-w-xl overflow-hidden rounded-lg border border-[#D6CCBA] bg-[#F7F4EC] p-4 sm:min-h-[360px] sm:p-6">
            <div className="absolute left-4 top-4 w-24 sm:left-6 sm:top-6 sm:w-40">
                <CoverVisual
                    author={post.book.author}
                    color={post.book.fallbackCoverColor}
                    imageUrl={post.book.officialCoverUrl}
                    title={post.book.title}
                />
            </div>
            {wantedBook && (
                <div className="absolute bottom-4 right-4 w-24 sm:bottom-6 sm:right-6 sm:w-40">
                    <CoverVisual
                        author={wantedBook.author}
                        color={wantedBook.fallbackCoverColor}
                        imageUrl={wantedBook.officialCoverUrl}
                        title={wantedBook.title}
                    />
                </div>
            )}
            <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#111827] text-white shadow-[0_12px_28px_rgba(17,24,39,0.20)] sm:h-16 sm:w-16">
                <Repeat2 className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.5} />
            </div>
        </div>
    );
};

const buildGallery = (post: BookDetailsPost): GalleryItem[] => {
    const coverItem: GalleryItem = {
        id: 'cover',
        label: 'Cover',
        type: 'cover',
        imageUrl: post.book.officialCoverUrl,
        color: post.book.fallbackCoverColor,
    };

    const photoItems = (post.sellerPhotos.length ? post.sellerPhotos : post.photoColors).map((_, index) => ({
        id: `photo-${index}`,
        label: 'Photo',
        type: 'photo' as const,
        imageUrl: post.sellerPhotos[index],
        color: post.photoColors[index] || fallbackPhotoColors[index] || '#F7F4EC',
    }));

    if (post.type === 'exchange') {
        return [{ id: 'exchange-view', label: 'Exchange view', type: 'exchange' }, ...photoItems];
    }

    return [coverItem, ...photoItems];
};

const Gallery = ({ post }: { post: BookDetailsPost }) => {
    const gallery = useMemo(() => buildGallery(post), [post]);
    const [selectedId, setSelectedId] = useState(gallery[0]?.id || 'cover');
    const selectedItem = gallery.find((item) => item.id === selectedId) || gallery[0];

    return (
        <section className="min-w-0 overflow-hidden rounded-lg border border-[#D6CCBA] bg-[#FFFDF8] p-3 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-5">
            <div className="grid min-h-[260px] min-w-0 place-items-center overflow-hidden rounded-lg bg-[#F7F4EC] p-3 sm:min-h-[400px] sm:p-5 lg:min-h-[430px]">
                {selectedItem?.type === 'exchange' ? (
                    <ExchangeVisual post={post} />
                ) : selectedItem?.type === 'photo' ? (
                    <SellerPhotoVisual
                        color={selectedItem.color || '#F7F4EC'}
                        imageUrl={selectedItem.imageUrl}
                        label={`${post.book.title} seller photo`}
                    />
                ) : (
                    <CoverVisual
                        author={post.book.author}
                        color={post.book.fallbackCoverColor}
                        imageUrl={post.book.officialCoverUrl}
                        title={post.book.title}
                    />
                )}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4 sm:gap-3">
                {gallery.map((item, index) => {
                    const isSelected = item.id === selectedId;

                    return (
                        <button
                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-[#F7F4EC] transition sm:h-24 sm:w-24 ${
                                isSelected ? 'border-[#111827]' : 'border-[#D6CCBA] hover:border-[#111827]'
                            }`}
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            type="button"
                            aria-label={`Show ${item.label.toLowerCase()} ${index + 1}`}
                        >
                            {item.type === 'exchange' ? (
                                <div className="grid h-full w-full place-items-center text-[#111827]">
                                    <Repeat2 size={28} strokeWidth={2.4} />
                                </div>
                            ) : item.imageUrl ? (
                                <img className="h-full w-full object-cover" src={item.imageUrl} alt="" />
                            ) : item.type === 'cover' ? (
                                <div className="flex h-full flex-col justify-between p-2" style={{ backgroundColor: item.color }}>
                                    <BookOpen size={20} strokeWidth={1.8} />
                                    <span className="font-sora line-clamp-2 text-[10px] font-extrabold text-[#111827]">
                                        {post.book.title}
                                    </span>
                                </div>
                            ) : (
                                <div className="relative h-full w-full" style={{ backgroundColor: item.color }}>
                                    <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-white/45" />
                                    <div className="absolute bottom-3 left-3 h-5 w-9 rounded-sm border-2 border-[#111827] bg-[#FFFDF8]" />
                                </div>
                            )}
                            <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-[#111827]">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-3 sm:p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8A8173]">{label}</p>
        <p className="mt-1 break-words text-sm font-extrabold text-[#111827]">{value}</p>
    </div>
);

const StatusNotice = ({ post }: { post: BookDetailsPost }) => {
    if (post.status === 'sold') {
        return (
            <div className="rounded-lg border border-[#FEE2E2] bg-[#FFF1F0] px-4 py-3 text-sm font-extrabold text-[#991B1B]">
                This book is sold
            </div>
        );
    }

    if (post.status === 'exchanged') {
        return (
            <div className="rounded-lg border border-[#EDE9FE] bg-[#F7F3FF] px-4 py-3 text-sm font-extrabold text-[#6D28D9]">
                This exchange is complete
            </div>
        );
    }

    return null;
};

const SellerMiniInfo = ({ post }: { post: BookDetailsPost }) => (
    <div className="rounded-lg border border-[#E8DFD1] bg-[#FFFDF8] p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8A8173]">Seller</p>
        <div className="mt-3 flex items-center gap-3">
            <div
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-white text-xs font-extrabold text-[#111827] shadow-[0_8px_18px_rgba(17,24,39,0.12)]"
                style={{ backgroundColor: post.seller.avatarColor }}
            >
                {post.seller.initials}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate font-sora text-base font-extrabold text-[#111827]">{post.seller.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#5F6675]">
                    <MapPin size={14} strokeWidth={2.2} />
                    {post.seller.area}
                </p>
            </div>
        </div>
        <Link
            className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-[#111827] underline decoration-[#D6CCBA] underline-offset-4"
            to={`/profile/${post.seller.id}`}
        >
            View Profile
            <ChevronRight size={16} strokeWidth={2.4} />
        </Link>
    </div>
);

type OrderFormState = ContactInfo & {
    proposedTitle: string;
    proposedAuthor: string;
    proposedCondition: string;
    proposedConditionNote: string;
    proposedPhotos: UploadedImage[];
};

const emptyOrderForm: OrderFormState = {
    contactName: '',
    phone: '',
    division: '',
    district: '',
    upazila: '',
    area: '',
    address: '',
    note: '',
    proposedTitle: '',
    proposedAuthor: '',
    proposedCondition: 'Good',
    proposedConditionNote: '',
    proposedPhotos: [],
};

const inputClass =
    'w-full rounded-lg border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-3 text-sm font-bold text-[#111827] outline-none transition placeholder:text-[#8A8175] focus:border-[#111827]';

const isBackendPostId = (id: string) => /^[a-f\d]{24}$/i.test(id);

const OrderRequestModal = ({ onClose, post }: { onClose: () => void; post: BookDetailsPost }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState<OrderFormState>(emptyOrderForm);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const isExchange = post.type === 'exchange';

    const updateField = (field: keyof OrderFormState, value: string | UploadedImage[]) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handlePhotoUpload = async (files: FileList | null) => {
        if (!files?.length) return;

        const nextFiles = Array.from(files).slice(0, 4 - form.proposedPhotos.length);
        if (!nextFiles.length) return;

        setIsUploading(true);
        setError('');

        try {
            const response = await uploadImages(nextFiles);
            updateField('proposedPhotos', [...form.proposedPhotos, ...response.data].slice(0, 4));
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Could not upload proposed book photos.');
        } finally {
            setIsUploading(false);
        }
    };

    const validate = () => {
        const requiredDeliveryFields: Array<keyof ContactInfo> = [
            'contactName',
            'phone',
            'division',
            'district',
            'upazila',
            'area',
            'address',
        ];

        if (requiredDeliveryFields.some((field) => !form[field]?.trim())) {
            return 'Please fill in all required delivery fields.';
        }

        if (isExchange) {
            if (!form.proposedTitle.trim() || !form.proposedAuthor.trim() || !form.proposedCondition.trim()) {
                return 'Please add the book you want to exchange with.';
            }

            if (!form.proposedPhotos.length) {
                return 'Please upload at least one photo of your proposed book.';
            }
        }

        return '';
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await createOrder({
                bookPostId: post.id,
                buyerDeliveryInfo: {
                    contactName: form.contactName,
                    phone: form.phone,
                    division: form.division,
                    district: form.district,
                    upazila: form.upazila,
                    area: form.area,
                    address: form.address,
                    note: form.note,
                },
                buyerProposedBook: isExchange
                    ? {
                          title: form.proposedTitle,
                          author: form.proposedAuthor,
                          condition: form.proposedCondition,
                          photos: form.proposedPhotos,
                          conditionNote: form.proposedConditionNote,
                      }
                    : undefined,
            });
            navigate('/orders');
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Could not place this request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#111827]/45 px-4 py-6 backdrop-blur-sm">
            <div className="mx-auto max-w-2xl rounded-lg border border-[#D6CCBA] bg-white p-5 shadow-[0_24px_80px_rgba(17,24,39,0.22)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8A8175]">
                            {isExchange ? 'Exchange request' : 'Book order'}
                        </p>
                        <h2 className="font-sora mt-2 text-2xl font-extrabold text-[#111827]">
                            {isExchange ? 'Request this exchange' : 'Order this book'}
                        </h2>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#626B78]">
                            Boi Station admins will use this information to arrange delivery after confirmation.
                        </p>
                    </div>
                    <button
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D6CCBA] text-[#111827] transition hover:bg-[#F4EFE6]"
                        onClick={onClose}
                        type="button"
                        aria-label="Close order form"
                    >
                        <X size={18} strokeWidth={2.4} />
                    </button>
                </div>

                {isExchange && (
                    <div className="mt-6 rounded-lg border border-[#D6CCBA] bg-[#FAF7EF] p-4">
                        <h3 className="font-sora text-lg font-extrabold text-[#111827]">Your proposed book</h3>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <input className={inputClass} onChange={(event) => updateField('proposedTitle', event.target.value)} placeholder="Book title" value={form.proposedTitle} />
                            <input className={inputClass} onChange={(event) => updateField('proposedAuthor', event.target.value)} placeholder="Author" value={form.proposedAuthor} />
                            <select className={inputClass} onChange={(event) => updateField('proposedCondition', event.target.value)} value={form.proposedCondition}>
                                <option>Like New</option>
                                <option>Good</option>
                                <option>Fair</option>
                                <option>Readable</option>
                            </select>
                            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#B7AA97] bg-white px-4 py-3 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]">
                                <Upload size={17} strokeWidth={2.4} />
                                {isUploading ? 'Uploading...' : 'Upload photos'}
                                <input className="sr-only" disabled={isUploading || form.proposedPhotos.length >= 4} multiple onChange={(event) => handlePhotoUpload(event.target.files)} type="file" accept="image/*" />
                            </label>
                        </div>
                        {form.proposedPhotos.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {form.proposedPhotos.map((photo, index) => (
                                    <img className="h-16 w-16 rounded-lg border border-[#D6CCBA] object-cover" key={`${photo.url}-${index}`} src={photo.url} alt={`Proposed book ${index + 1}`} />
                                ))}
                            </div>
                        )}
                        <textarea className={`${inputClass} mt-3 min-h-24 resize-none`} onChange={(event) => updateField('proposedConditionNote', event.target.value)} placeholder="Short condition note" value={form.proposedConditionNote} />
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="font-sora text-lg font-extrabold text-[#111827]">Delivery information</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <input className={inputClass} onChange={(event) => updateField('contactName', event.target.value)} placeholder="Contact name" value={form.contactName} />
                        <input className={inputClass} onChange={(event) => updateField('phone', event.target.value)} placeholder="Phone number" value={form.phone} />
                        <select className={inputClass} onChange={(event) => setForm((current) => ({ ...current, division: event.target.value, district: '', upazila: '' }))} value={form.division}>
                            <option value="">Select division</option>
                            {divisions.map((division) => <option key={division} value={division}>{division}</option>)}
                        </select>
                        <select className={inputClass} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value, upazila: '' }))} value={form.district}>
                            <option value="">Select district</option>
                            {getDistrictsForDivision(form.division).map((district) => <option key={district} value={district}>{district}</option>)}
                        </select>
                        <select className={inputClass} onChange={(event) => updateField('upazila', event.target.value)} value={form.upazila}>
                            <option value="">Select upazila / thana</option>
                            {getUpazilasForDistrict(form.district).map((upazila) => <option key={upazila} value={upazila}>{upazila}</option>)}
                        </select>
                        <input className={inputClass} onChange={(event) => updateField('area', event.target.value)} placeholder="Area / landmark" value={form.area} />
                        <textarea className={`${inputClass} min-h-24 resize-none sm:row-span-2`} onChange={(event) => updateField('address', event.target.value)} placeholder="Full delivery address" value={form.address} />
                        <textarea className={`${inputClass} min-h-24 resize-none sm:col-span-2`} onChange={(event) => updateField('note', event.target.value)} placeholder="Delivery note (optional)" value={form.note} />
                    </div>
                </div>

                {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button className="rounded-full border border-[#D6CCBA] px-6 py-3 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]" onClick={onClose} type="button">
                        Cancel
                    </button>
                    <button className="rounded-full bg-[#111827] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || isUploading} onClick={handleSubmit} type="button">
                        {isSubmitting ? 'Submitting...' : isExchange ? 'Send exchange request' : 'Place order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ActionPanel = ({ post }: { post: BookDetailsPost }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useMockAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isSavingBook, setIsSavingBook] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [isStartingChat, setIsStartingChat] = useState(false);
    const [chatError, setChatError] = useState('');
    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [orderError, setOrderError] = useState('');
    const isUnavailable = post.status === 'sold' || post.status === 'exchanged';
    const messageLabel = post.type === 'sell' ? 'Message Seller' : 'Message Owner';
    const messagePath = `/messages?book=${post.id}&seller=${post.seller.id}`;
    const orderLabel = post.type === 'sell' ? 'Order Book' : 'Request Exchange';
    useEffect(() => {
        if (!isAuthenticated || !post.id.match(/^[a-f\d]{24}$/i)) {
            setIsSaved(false);
            return;
        }

        let isActive = true;

        isBookSaved(post.id)
            .then((saved) => {
                if (isActive) setIsSaved(saved);
            })
            .catch(() => undefined);

        return () => {
            isActive = false;
        };
    }, [isAuthenticated, post.id]);

    const handleSave = async () => {
        if (!isAuthenticated) {
            navigate(createLoginRedirect(`/books/${post.id}`));
            return;
        }

        if (!post.id.match(/^[a-f\d]{24}$/i)) {
            setSaveError('Demo posts cannot be saved to your account.');
            return;
        }

        setIsSavingBook(true);
        setSaveError('');

        try {
            if (isSaved) {
                await removeSavedBook(post.id);
                setIsSaved(false);
            } else {
                await saveBook(post.id);
                setIsSaved(true);
            }
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Could not update saved books.');
        } finally {
            setIsSavingBook(false);
        }
    };
    const handleStartConversation = async () => {
        if (!isAuthenticated) {
            navigate(createLoginRedirect(messagePath));
            return;
        }

        setIsStartingChat(true);
        setChatError('');

        try {
            const response = await createConversation(post.id);
            navigate(`/messages?conversation=${response.data._id}`);
        } catch (error) {
            setChatError(error instanceof Error ? error.message : 'Could not open this conversation.');
        } finally {
            setIsStartingChat(false);
        }
    };

    const handleOpenOrder = () => {
        if (!isAuthenticated) {
            navigate(createLoginRedirect(`/books/${post.id}`));
            return;
        }

        if (!isBackendPostId(post.id)) {
            setOrderError('Demo posts cannot be ordered yet. Please try a live post from the feed.');
            return;
        }

        setOrderError('');
        setIsOrderOpen(true);
    };

    return (
        <>
        <aside className="min-w-0 overflow-hidden rounded-lg border border-[#D6CCBA] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] sm:p-5 lg:p-6">
            <div className="flex flex-wrap items-center gap-2">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        post.type === 'sell' ? 'bg-[#EAF4EE] text-[#14532D]' : 'bg-[#EAF2FF] text-[#1D4ED8]'
                    }`}
                >
                    {post.type === 'sell' ? 'For Sale' : 'Exchange'}
                </span>
                {post.status === 'sold' && (
                    <span className="rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-extrabold text-[#991B1B]">
                        Sold
                    </span>
                )}
                {post.status === 'exchanged' && (
                    <span className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-extrabold text-[#6D28D9]">
                        Exchanged
                    </span>
                )}
            </div>

            {post.type === 'sell' ? (
                <>
                    <h1 className="font-sora mt-4 line-clamp-3 text-2xl font-extrabold leading-tight text-[#111827] sm:mt-5 sm:text-4xl">
                        {post.book.title}
                    </h1>
                    <p className="mt-2 text-base font-bold text-[#4F5865]">{post.book.author}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
                        <p className="font-sora text-2xl font-extrabold text-[#111827] sm:text-3xl">{post.priceLabel}</p>
                        {post.negotiable && (
                            <span className="rounded-full bg-[#FFE8A3] px-3 py-1 text-xs font-extrabold text-[#7C2D12]">
                                Negotiable
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <div className="mt-5 space-y-4">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#626B78]">Offering</p>
                        <h1 className="font-sora mt-1 line-clamp-3 text-2xl font-extrabold leading-tight text-[#111827] sm:text-4xl">
                            {post.book.title}
                        </h1>
                        <p className="mt-2 text-base font-bold text-[#4F5865]">{post.book.author}</p>
                    </div>
                    {post.wantedBook && (
                        <div className="rounded-lg border border-[#D6CCBA] bg-[#F7F2E8] p-4">
                            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#626B78]">Wants</p>
                            <h2 className="font-sora mt-1 line-clamp-2 text-xl font-extrabold leading-tight text-[#111827]">
                                {post.wantedBook.title}
                            </h2>
                            <p className="mt-1 text-sm font-bold text-[#4F5865]">{post.wantedBook.author}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 grid gap-3">
                {isUnavailable ? (
                    <button
                        className="inline-flex w-full min-w-0 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#D1D5DB] px-5 py-4 text-sm font-extrabold text-[#6B7280]"
                        disabled
                        type="button"
                    >
                        <MessageCircle size={18} strokeWidth={2.4} />
                        {post.status === 'sold' ? 'This book is sold' : 'This exchange is complete'}
                    </button>
                ) : (
                    <>
                    <button
                        className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                        onClick={handleOpenOrder}
                        type="button"
                    >
                        <PackageCheck size={18} strokeWidth={2.4} />
                        {orderLabel}
                    </button>
                    {orderError ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                            {orderError}
                        </p>
                    ) : null}
                    <button
                        className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-white px-5 py-3 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isStartingChat}
                        onClick={handleStartConversation}
                        type="button"
                    >
                        <MessageCircle size={18} strokeWidth={2.4} />
                        {isStartingChat ? 'Opening chat...' : messageLabel}
                    </button>
                    </>
                )}
                {chatError ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        {chatError}
                    </p>
                ) : null}
                <button
                    className={`inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-extrabold transition ${
                        isSaved
                            ? 'border-[#A8EBC4] bg-[#E6F8EF] text-[#14532D]'
                            : 'border-[#D6CCBA] bg-white text-[#111827] hover:bg-[#F4EFE6]'
                    }`}
                    disabled={isSavingBook}
                    onClick={handleSave}
                    type="button"
                >
                    {isSaved ? <BookmarkCheck size={18} strokeWidth={2.4} /> : <Bookmark size={18} strokeWidth={2.4} />}
                    {isSavingBook ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </button>
                {saveError ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        {saveError}
                    </p>
                ) : null}
            </div>

            <div className="mt-5">
                <StatusNotice post={post} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <DetailItem label="Condition" value={post.book.condition} />
                <DetailItem label="Category" value={post.book.category} />
                <DetailItem label="Location" value={post.location} />
                <DetailItem label="Posted" value={post.createdAt} />
            </div>

            <div className="mt-5">
                <SellerMiniInfo post={post} />
            </div>
        </aside>
        {isOrderOpen && <OrderRequestModal post={post} onClose={() => setIsOrderOpen(false)} />}
        </>
    );
};

const DescriptionArea = ({ post }: { post: BookDetailsPost }) => {
    const hasAbout = Boolean(post.book.officialDescription);
    const hasSellerNote = Boolean(post.sellerNote);

    if (!hasAbout && !hasSellerNote) {
        return null;
    }

    return (
        <section className="mt-6 rounded-lg border border-[#D6CCBA] bg-[#FFFDF8] p-5 shadow-[0_10px_30px_rgba(17,24,39,0.04)] sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
                {hasAbout && (
                    <div>
                        <h2 className="font-sora text-2xl font-extrabold text-[#111827]">About this book</h2>
                        <p className="mt-3 text-base leading-8 text-[#4F5865]">{post.book.officialDescription}</p>
                    </div>
                )}
                {hasSellerNote && (
                    <div>
                        <h2 className="font-sora text-2xl font-extrabold text-[#111827]">Seller note</h2>
                        <p className="mt-3 text-base leading-8 text-[#4F5865]">{post.sellerNote}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

const NotFound = () => (
    <main className="min-h-screen bg-[#FAF7EF] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-[#D6CCBA] bg-white p-8 text-center shadow-[0_16px_38px_rgba(17,24,39,0.08)]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#F4EFE6] text-[#111827]">
                <BookOpen size={26} strokeWidth={2.2} />
            </div>
            <h1 className="font-sora mt-5 text-3xl font-extrabold text-[#111827]">Book post not found</h1>
            <p className="mt-3 text-base leading-7 text-[#4F5865]">
                The post may have been removed, or the link may be incorrect.
            </p>
            <Link
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                to="/buy-sell"
            >
                Back to books
            </Link>
        </div>
    </main>
);

const LoadingDetails = () => (
    <main className="min-h-screen bg-[#FAF7EF] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-[#D6CCBA] bg-white p-8 text-center shadow-[0_16px_38px_rgba(17,24,39,0.08)]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#F4EFE6] text-[#111827]">
                <BookOpen className="animate-pulse" size={26} strokeWidth={2.2} />
            </div>
            <h1 className="font-sora mt-5 text-3xl font-extrabold text-[#111827]">Loading book post</h1>
            <p className="mt-3 text-base leading-7 text-[#4F5865]">Checking the latest details from Boi Station.</p>
        </div>
    </main>
);

const BookDetails = () => {
    const { id } = useParams();
    const [remotePost, setRemotePost] = useState<BookDetailsPost>();
    const [isLoading, setIsLoading] = useState(Boolean(id));

    useEffect(() => {
        if (!id) {
            return;
        }

        let isActive = true;
        setIsLoading(true);

        getBookPost(id)
            .then((response) => {
                if (!isActive) return;
                setRemotePost(mapBackendBookToDetailsPost(response.data));
            })
            .catch(() => {
                if (!isActive) return;
                setRemotePost(undefined);
            })
            .finally(() => {
                if (!isActive) return;
                setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [id]);

    const post = remotePost;

    if (isLoading) {
        return <LoadingDetails />;
    }

    if (!post) {
        return <NotFound />;
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#FAF7EF] px-3 py-8 text-[#111827] sm:px-6 sm:py-12 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-[1180px] min-w-0">
                <Link
                    className="inline-flex items-center gap-2 rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-2 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]"
                    to={post.type === 'exchange' ? '/exchange' : '/buy-sell'}
                >
                    <ArrowLeft size={17} strokeWidth={2.4} />
                    Back to books
                </Link>

                <div className="mt-5 grid min-w-0 gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
                    <Gallery post={post} />
                    <ActionPanel post={post} />
                </div>

                <DescriptionArea post={post} />
            </div>
        </main>
    );
};

export default BookDetails;
