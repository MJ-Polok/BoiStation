import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    ImagePlus,
    Loader2,
    Repeat2,
    Search,
    Upload,
    X,
} from 'lucide-react';
import SellPostCard from '../buy-sell/SellPostCard';
import type { SellPost } from '../buy-sell/data/sellPosts';
import ExchangePostCard from '../exchange/ExchangePostCard';
import type { ExchangePost } from '../exchange/data/exchangePosts';
import {
    createBookPost,
    searchOfficialBooks,
    uploadImages,
    type CreateBookPostPayload,
    type UploadedImage,
} from './api';
import { divisions, getDistrictsForDivision, getUpazilasForDistrict } from '../../data/bangladeshLocations';

type PostType = 'sell' | 'exchange' | '';
type BookSource = 'database' | 'manual';

type BookOption = {
    id: string;
    sourceId?: string;
    title: string;
    author: string;
    publisherYear: string;
    coverUrl?: string;
    coverColor: string;
    description?: string;
};

type SelectedBook = BookOption & {
    source: BookSource;
};

type PhotoPreview = {
    id: string;
    name: string;
    url: string;
    file: File;
};

type ManualBook = {
    title: string;
    author: string;
    publisherYear: string;
    description: string;
    frontCoverUrl?: string;
    frontCoverName?: string;
    frontCoverFile?: File;
};

type Details = {
    price: string;
    negotiable: boolean;
    priceReason: string;
    pricingRuleAccepted: boolean;
    category: string;
    condition: string;
    location: string;
    note: string;
    pickupContactName: string;
    pickupPhone: string;
    pickupDivision: string;
    pickupDistrict: string;
    pickupUpazila: string;
    pickupArea: string;
    pickupAddress: string;
    pickupNote: string;
};

type StepKey = 'book' | 'photos' | 'type' | 'wanted' | 'details' | 'preview';

const bookOptions: BookOption[] = [
    {
        id: 'atomic-habits',
        title: 'Atomic Habits',
        author: 'James Clear',
        publisherYear: 'Avery, 2018',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
        coverColor: '#EAF4EE',
        description: 'A practical guide to building good habits and breaking bad ones.',
    },
    {
        id: 'the-alchemist',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        publisherYear: 'HarperOne, 1993',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
        coverColor: '#EAF2FF',
        description: 'A story about dreams, courage, and following a personal legend.',
    },
    {
        id: 'deep-work',
        title: 'Deep Work',
        author: 'Cal Newport',
        publisherYear: 'Grand Central, 2016',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
        coverColor: '#F4EFE6',
        description: 'A book about focused work in a distracted world.',
    },
    {
        id: 'english-grammar',
        title: 'English Grammar in Use',
        author: 'Raymond Murphy',
        publisherYear: 'Cambridge University Press',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781108457651-L.jpg',
        coverColor: '#FFF3D6',
        description: 'A self-study grammar reference and practice book.',
    },
    {
        id: 'rich-dad-poor-dad',
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        publisherYear: 'Plata Publishing, 1997',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
        coverColor: '#F4EFE6',
        description: 'Personal finance lessons told through two different money mindsets.',
    },
    {
        id: 'hsc-physics-notes',
        title: 'HSC Physics Notes',
        author: 'Seller Collection',
        publisherYear: 'Academic notes',
        coverColor: '#FFF3D6',
        description: 'Collected notes for HSC physics preparation.',
    },
];

const categories = ['Academic', 'Admission', 'Novel', 'Story Book', 'Religious', 'Self-help', 'Reference', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const emptyManualBook: ManualBook = {
    title: '',
    author: '',
    publisherYear: '',
    description: '',
};

const emptyDetails: Details = {
    price: '',
    negotiable: false,
    priceReason: '',
    pricingRuleAccepted: false,
    category: '',
    condition: '',
    location: '',
    note: '',
    pickupContactName: '',
    pickupPhone: '',
    pickupDivision: '',
    pickupDistrict: '',
    pickupUpazila: '',
    pickupArea: '',
    pickupAddress: '',
    pickupNote: '',
};

const stepLabels: Record<StepKey, string> = {
    book: 'Your Book',
    photos: 'Photos',
    type: 'Type',
    wanted: 'Wanted Book',
    details: 'Details',
    preview: 'Preview',
};

const searchLocalBooks = (query: string) => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
        return [];
    }

    return bookOptions
        .filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(cleanQuery))
        .slice(0, 5);
};

const mapOfficialBookToOption = (book: Awaited<ReturnType<typeof searchOfficialBooks>>['data'][number]): BookOption => ({
    id: book.sourceId,
    sourceId: book.sourceId,
    title: book.title,
    author: book.author,
    publisherYear: book.publisherYear,
    coverUrl: book.coverUrl,
    coverColor: '#F7F2E8',
    description: book.description,
});

const isManualBookValid = (book: ManualBook, requireFrontCover = false) =>
    book.title.trim().length > 0 && book.author.trim().length > 0 && (!requireFrontCover || Boolean(book.frontCoverUrl));

const createManualBook = (book: ManualBook, id: string): SelectedBook => ({
    id,
    title: book.title.trim(),
    author: book.author.trim(),
    publisherYear: book.publisherYear.trim() || 'Manual details',
    description: book.description.trim(),
    coverUrl: book.frontCoverUrl,
    coverColor: '#F7F2E8',
    source: 'manual',
});

const CoverBlock = ({ book, size = 'md' }: { book?: SelectedBook | BookOption; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClass = {
        sm: 'h-24 w-16',
        md: 'h-36 w-24',
        lg: 'h-48 w-32',
    }[size];

    if (!book) {
        return (
            <div className={`${sizeClass} rounded-md border border-dashed border-[#D8CDBB] bg-[#F7F2E8]`} />
        );
    }

    return (
        <div className={`${sizeClass} overflow-hidden rounded-md border-2 border-[#111827] bg-[#FFFDF8]`}>
            {book.coverUrl ? (
                <img className="h-full w-full object-cover" src={book.coverUrl} alt={`${book.title} cover`} />
            ) : (
                <div className="flex h-full flex-col justify-between p-3" style={{ backgroundColor: book.coverColor }}>
                    <p className="font-sora line-clamp-4 text-sm font-extrabold leading-tight text-[#111827]">
                        {book.title}
                    </p>
                    <BookOpen size={24} strokeWidth={1.8} />
                </div>
            )}
        </div>
    );
};

const FieldLabel = ({ children }: { children: string }) => (
    <label className="text-sm font-extrabold text-[#111827]">{children}</label>
);

const TextInput = ({
    label,
    onChange,
    placeholder,
    type = 'text',
    value,
}: {
    label: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
    value: string;
}) => (
    <div className="grid gap-2">
        <FieldLabel>{label}</FieldLabel>
        <input
            className="h-12 rounded-full border border-[#D8CDBB] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8173] focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            type={type}
            value={value}
        />
    </div>
);

const SelectInput = ({
    label,
    onChange,
    options,
    placeholder,
    value,
}: {
    label: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    value: string;
}) => (
    <div className="grid gap-2">
        <FieldLabel>{label}</FieldLabel>
        <select
            className="h-12 rounded-full border border-[#D8CDBB] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
            onChange={(event) => onChange(event.target.value)}
            value={value}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

const StepHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
        <h2 className="font-sora text-3xl font-extrabold tracking-normal text-[#111827]">{title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5F6675]">{subtitle}</p>
    </div>
);

const BookResult = ({ book, onSelect }: { book: BookOption; onSelect: (book: SelectedBook) => void }) => (
    <button
        className="flex w-full items-center gap-4 rounded-lg border border-[#E8DFD1] bg-white p-3 text-left transition hover:border-[#111827] hover:bg-[#F7F2E8]"
        onClick={() => onSelect({ ...book, source: 'database' })}
        type="button"
    >
        <CoverBlock book={book} size="sm" />
        <span className="min-w-0 flex-1">
            <span className="font-sora block truncate text-base font-extrabold text-[#111827]">{book.title}</span>
            <span className="mt-1 block truncate text-sm font-semibold text-[#5F6675]">{book.author}</span>
            <span className="mt-1 block truncate text-xs font-bold text-[#8A8173]">{book.publisherYear}</span>
        </span>
        <span className="rounded-full bg-[#111827] px-4 py-2 text-xs font-extrabold text-white">Select</span>
    </button>
);

const SelectedBookSummary = ({
    badge,
    book,
    onChange,
}: {
    badge: string;
    book: SelectedBook;
    onChange: () => void;
}) => (
    <div className="flex flex-col gap-4 rounded-lg border border-[#D8CDBB] bg-[#FFFDF8] p-4 sm:flex-row sm:items-center">
        <CoverBlock book={book} size="md" />
        <div className="min-w-0 flex-1">
            <span className="rounded-full bg-[#E6F8EF] px-3 py-1 text-xs font-extrabold text-[#14532D]">
                {badge}
            </span>
            <h3 className="font-sora mt-3 line-clamp-2 text-2xl font-extrabold leading-tight text-[#111827]">
                {book.title}
            </h3>
            <p className="mt-2 text-sm font-bold text-[#5F6675]">{book.author}</p>
            <p className="mt-1 text-xs font-semibold text-[#8A8173]">{book.publisherYear}</p>
        </div>
        <button
            className="rounded-full border border-[#D8CDBB] px-5 py-2.5 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]"
            onClick={onChange}
            type="button"
        >
            Change
        </button>
    </div>
);

const BookSearchStep = ({
    errorMessage,
    isSearching,
    manual,
    manualButtonLabel,
    onManualChange,
    onSelect,
    query,
    results,
    searchPlaceholder,
    selected,
    selectedBadge,
    requireFrontCover = false,
    setQuery,
    subtitle,
    title,
}: {
    errorMessage?: string;
    isSearching?: boolean;
    manual: ManualBook;
    manualButtonLabel: string;
    onManualChange: (book: ManualBook) => void;
    onSelect: (book: SelectedBook | undefined) => void;
    query: string;
    results: BookOption[];
    searchPlaceholder: string;
    selected?: SelectedBook;
    selectedBadge: string;
    requireFrontCover?: boolean;
    setQuery: (query: string) => void;
    subtitle: string;
    title: string;
}) => {
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [touched, setTouched] = useState(false);
    const hasQuery = query.trim().length > 0;

    return (
        <div className="space-y-8">
            <StepHeader title={title} subtitle={subtitle} />

            {selected ? (
                <SelectedBookSummary
                    badge={selectedBadge}
                    book={selected}
                    onChange={() => {
                        onSelect(undefined);
                        setIsManualOpen(false);
                    }}
                />
            ) : (
                <div className="space-y-5">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8173]" size={19} />
                        <input
                            className="h-14 w-full rounded-full border border-[#D8CDBB] bg-white pl-12 pr-4 text-base font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8173] focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setTouched(true);
                            }}
                            placeholder={searchPlaceholder}
                            type="search"
                            value={query}
                        />
                    </div>

                    {hasQuery && (
                        <div className="space-y-3 rounded-xl border border-[#E8DFD1] bg-[#FAF7EF] p-3">
                            {isSearching ? (
                                <div className="flex items-center gap-2 rounded-lg bg-white p-5 text-sm font-extrabold text-[#5F6675]">
                                    <Loader2 className="animate-spin" size={18} />
                                    Searching book database...
                                </div>
                            ) : errorMessage ? (
                                <div className="rounded-lg bg-white p-5">
                                    <p className="font-sora text-lg font-extrabold text-[#111827]">
                                        Could not search right now.
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[#5F6675]">
                                        {errorMessage}
                                    </p>
                                </div>
                            ) : results.length > 0 ? (
                                results.map((book) => <BookResult book={book} key={book.id} onSelect={onSelect} />)
                            ) : (
                                <div className="rounded-lg bg-white p-5">
                                    <p className="font-sora text-lg font-extrabold text-[#111827]">
                                        No matching books found.
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[#5F6675]">
                                        You can still post this book with manual details.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="inline-flex items-center gap-2 rounded-full border border-[#D8CDBB] bg-white px-5 py-3 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6]"
                        onClick={() => setIsManualOpen(true)}
                        type="button"
                    >
                        <BookOpen size={17} strokeWidth={2.3} />
                        {manualButtonLabel}
                    </button>

                    {isManualOpen && (
                        <div className="grid gap-4 rounded-xl border border-[#D8CDBB] bg-[#FFFDF8] p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextInput
                                    label={selectedBadge === 'Wanted book' ? 'Wanted book title' : 'Book title'}
                                    onChange={(value) => onManualChange({ ...manual, title: value })}
                                    placeholder={selectedBadge === 'Wanted book' ? 'Wanted book title' : 'Book title'}
                                    value={manual.title}
                                />
                                <TextInput
                                    label="Author"
                                    onChange={(value) => onManualChange({ ...manual, author: value })}
                                    placeholder="Author"
                                    value={manual.author}
                                />
                            </div>
                            <TextInput
                                label="Publisher or year (optional)"
                                onChange={(value) => onManualChange({ ...manual, publisherYear: value })}
                                placeholder="Publisher or year"
                                value={manual.publisherYear}
                            />
                            {selectedBadge !== 'Wanted book' && (
                                <>
                                    <div className="grid gap-2">
                                        <FieldLabel>Short description (optional)</FieldLabel>
                                        <textarea
                                            className="min-h-28 rounded-2xl border border-[#D8CDBB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8173] focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
                                            onChange={(event) => onManualChange({ ...manual, description: event.target.value })}
                                            placeholder="Short description"
                                            value={manual.description}
                                        />
                                    </div>
                                    {requireFrontCover && (
                                        <div className="grid gap-2">
                                            <FieldLabel>Front cover photo</FieldLabel>
                                            <label className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-dashed border-[#D8CDBB] bg-white p-4 transition hover:border-[#111827] sm:flex-row sm:items-center">
                                                <input
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];

                                                        if (!file || !file.type.startsWith('image/')) {
                                                            return;
                                                        }

                                                        onManualChange({
                                                            ...manual,
                                                            frontCoverName: file.name,
                                                            frontCoverFile: file,
                                                            frontCoverUrl: URL.createObjectURL(file),
                                                        });
                                                    }}
                                                    type="file"
                                                />
                                                <span className="grid h-28 w-20 shrink-0 place-items-center overflow-hidden rounded-md border-2 border-[#111827] bg-[#F7F2E8]">
                                                    {manual.frontCoverUrl ? (
                                                        <img
                                                            className="h-full w-full object-cover"
                                                            src={manual.frontCoverUrl}
                                                            alt="Manual front cover"
                                                        />
                                                    ) : (
                                                        <ImagePlus size={24} strokeWidth={2.2} />
                                                    )}
                                                </span>
                                                <span>
                                                    <span className="font-sora block text-lg font-extrabold text-[#111827]">
                                                        Upload the book front cover
                                                    </span>
                                                    <span className="mt-1 block text-sm font-semibold text-[#5F6675]">
                                                        Required for manually added books. This will be used as the poster.
                                                    </span>
                                                    {manual.frontCoverName && (
                                                        <span className="mt-2 block text-xs font-extrabold text-[#14532D]">
                                                            {manual.frontCoverName}
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </>
                            )}
                            <button
                                className="justify-self-start rounded-full bg-[#111827] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-45"
                                disabled={!isManualBookValid(manual, requireFrontCover)}
                                onClick={() => onSelect(createManualBook(manual, selectedBadge === 'Wanted book' ? 'manual-wanted-book' : 'manual-book'))}
                                type="button"
                            >
                                Save manual details
                            </button>
                        </div>
                    )}

                    {touched && !hasQuery && (
                        <p className="text-sm font-bold text-[#8A8173]">Start typing to search books.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const PhotosStep = ({
    photos,
    setPhotos,
}: {
    photos: PhotoPreview[];
    setPhotos: (photos: PhotoPreview[]) => void;
}) => {
    const [error, setError] = useState('');

    const handleFiles = (files: FileList | null) => {
        if (!files) {
            return;
        }

        const incoming = Array.from(files);

        if (incoming.some((file) => !file.type.startsWith('image/'))) {
            setError('Upload image files only.');
            return;
        }

        if (photos.length + incoming.length > 4) {
            setError('You can upload up to 4 photos.');
            return;
        }

        const nextPhotos = incoming.map((file) => ({
            id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
            name: file.name,
            url: URL.createObjectURL(file),
            file,
        }));

        setError('');
        setPhotos([...photos, ...nextPhotos]);
    };

    return (
        <div className="space-y-8">
            <StepHeader
                title="Add photos of your book"
                subtitle="Upload clear photos that show the real condition."
            />

            <label className="group grid min-h-56 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[#D8CDBB] bg-white p-8 text-center transition hover:border-[#111827] hover:bg-[#FFFDF8]">
                <input
                    accept="image/*"
                    className="sr-only"
                    multiple
                    onChange={(event) => handleFiles(event.target.files)}
                    type="file"
                />
                <span>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#E6F8EF] text-[#111827]">
                        <Upload size={24} strokeWidth={2.3} />
                    </span>
                    <span className="font-sora mt-4 block text-xl font-extrabold text-[#111827]">
                        Drop photos here or browse
                    </span>
                    <span className="mt-2 block text-sm font-semibold text-[#5F6675]">
                        1-4 photos, image files only.
                    </span>
                </span>
            </label>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-[#FDA29B] bg-[#FFF1F0] px-4 py-3 text-sm font-bold text-[#B42318]">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {photos.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {photos.map((photo, index) => (
                        <div className="relative overflow-hidden rounded-xl border border-[#D8CDBB] bg-white p-2" key={photo.id}>
                            <img className="aspect-[4/3] w-full rounded-lg object-cover" src={photo.url} alt={photo.name} />
                            {index === 0 && (
                                <span className="absolute left-4 top-4 rounded-full bg-[#111827] px-3 py-1 text-xs font-extrabold text-white">
                                    Main photo
                                </span>
                            )}
                            <button
                                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white text-[#111827] shadow"
                                onClick={() => setPhotos(photos.filter((item) => item.id !== photo.id))}
                                type="button"
                                aria-label="Remove photo"
                            >
                                <X size={16} strokeWidth={2.4} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TypeStep = ({ postType, setPostType }: { postType: PostType; setPostType: (type: PostType) => void }) => {
    const [showDonateHelper, setShowDonateHelper] = useState(false);

    return (
        <div className="space-y-8">
            <StepHeader
                title="What do you want to do with this book?"
                subtitle="Choose one option for this post."
            />

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { type: 'sell' as const, title: 'Sell', text: 'Set a price and find a buyer.' },
                    { type: 'exchange' as const, title: 'Exchange', text: 'Trade this book for another one.' },
                ].map((option) => (
                    <button
                        className={`rounded-2xl border p-5 text-left transition ${
                            postType === option.type
                                ? 'border-[#111827] bg-[#F7F2E8] shadow-[6px_6px_0_rgba(17,24,39,0.10)]'
                                : 'border-[#D8CDBB] bg-white hover:border-[#111827]'
                        }`}
                        key={option.type}
                        onClick={() => setPostType(option.type)}
                        type="button"
                    >
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#E6F8EF] text-[#111827]">
                            {option.type === 'sell' ? <BookOpen size={21} /> : <Repeat2 size={21} />}
                        </span>
                        <span className="font-sora mt-5 block text-2xl font-extrabold text-[#111827]">
                            {option.title}
                        </span>
                        <span className="mt-2 block text-sm font-semibold leading-6 text-[#5F6675]">{option.text}</span>
                    </button>
                ))}

                <button
                    className="relative cursor-not-allowed rounded-2xl border border-[#F2CE73] bg-[#FFF3D6] p-5 text-left opacity-80"
                    onClick={() => setShowDonateHelper(true)}
                    type="button"
                >
                    <span className="absolute right-4 top-4 rounded-full border border-[#F2CE73] bg-white px-3 py-1 text-xs font-extrabold text-[#8A5A00]">
                        Coming soon
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#111827]">
                        <ImagePlus size={21} />
                    </span>
                    <span className="font-sora mt-5 block text-2xl font-extrabold text-[#111827]">Donate</span>
                    <span className="mt-2 block text-sm font-semibold leading-6 text-[#8A5A00]">
                        Donation posts are coming soon.
                    </span>
                </button>
            </div>

            {showDonateHelper && (
                <p className="rounded-xl border border-[#F2CE73] bg-[#FFF3D6] px-4 py-3 text-sm font-bold text-[#8A5A00]">
                    Donation posts are coming soon.
                </p>
            )}
        </div>
    );
};

const DetailsStep = ({
    details,
    postType,
    setDetails,
}: {
    details: Details;
    postType: PostType;
    setDetails: (details: Details) => void;
}) => (
    <div className="space-y-8">
        <StepHeader
            title={postType === 'exchange' ? 'Add exchange details' : 'Add selling details'}
            subtitle="Add the required details so readers know if this post is right for them."
        />

        <div className="grid gap-5">
            {postType === 'sell' && (
                <div className="grid gap-5 rounded-2xl border border-[#E8DFD1] bg-[#FAF7EF] p-4 sm:p-5">
                    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                        <TextInput
                            label="Price"
                            onChange={(value) => setDetails({ ...details, price: value })}
                            placeholder="Enter price"
                            type="number"
                            value={details.price}
                        />
                        <label className="flex h-12 items-center gap-3 rounded-full border border-[#D8CDBB] bg-white px-4 text-sm font-extrabold text-[#111827]">
                            <input
                                checked={details.negotiable}
                                className="h-4 w-4 accent-[#111827]"
                                onChange={(event) => setDetails({ ...details, negotiable: event.target.checked })}
                                type="checkbox"
                            />
                            Negotiable
                        </label>
                    </div>

                    <div className="rounded-2xl border border-[#F2CE73] bg-[#FFF3D6] px-4 py-3 text-sm font-bold leading-6 text-[#7C2D12]">
                        Second-hand books should be listed at 30% or less of the original/MRP price. Set a fair price based on the book&apos;s condition.
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel>Why is this price fair? (optional)</FieldLabel>
                        <textarea
                            className="min-h-24 rounded-2xl border border-[#D8CDBB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8173] focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
                            onChange={(event) => setDetails({ ...details, priceReason: event.target.value })}
                            placeholder="Example: Low price because the cover is old, but pages are clean."
                            value={details.priceReason}
                        />
                    </div>

                    <label className="flex items-start gap-3 rounded-2xl border border-[#D8CDBB] bg-white px-4 py-3 text-sm font-extrabold leading-6 text-[#111827]">
                        <input
                            checked={details.pricingRuleAccepted}
                            className="mt-1 h-4 w-4 shrink-0 accent-[#111827]"
                            onChange={(event) => setDetails({ ...details, pricingRuleAccepted: event.target.checked })}
                            type="checkbox"
                        />
                        <span>I confirm this price follows Boi Station&apos;s second-hand book pricing rule.</span>
                    </label>
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <SelectInput
                    label="Category"
                    onChange={(value) => setDetails({ ...details, category: value })}
                    options={categories}
                    placeholder="Select category"
                    value={details.category}
                />
                <SelectInput
                    label="Condition"
                    onChange={(value) => setDetails({ ...details, condition: value })}
                    options={conditions}
                    placeholder="Select condition"
                    value={details.condition}
                />
            </div>

            <TextInput
                label="Location"
                onChange={(value) => setDetails({ ...details, location: value })}
                placeholder="Enter your area or city"
                value={details.location}
            />

            <div className="grid gap-2">
                <FieldLabel>Note (optional)</FieldLabel>
                <textarea
                    className="min-h-32 rounded-2xl border border-[#D8CDBB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8173] focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
                    onChange={(event) => setDetails({ ...details, note: event.target.value })}
                    placeholder={postType === 'exchange' ? 'Mention what kind of exchange you prefer' : 'Add anything buyers should know'}
                    value={details.note}
                />
            </div>

            <div className="rounded-2xl border border-[#D8CDBB] bg-[#FAF7EF] p-5">
                <div>
                    <h3 className="font-sora text-2xl font-extrabold text-[#111827]">Pickup information</h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-[#5F6675]">
                        Only Boi Station admins and delivery team can see this.
                    </p>
                </div>

                <div className="mt-5 grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <TextInput
                            label="Contact name"
                            onChange={(value) => setDetails({ ...details, pickupContactName: value })}
                            placeholder="Who should we contact?"
                            value={details.pickupContactName}
                        />
                        <TextInput
                            label="Phone"
                            onChange={(value) => setDetails({ ...details, pickupPhone: value })}
                            placeholder="Pickup contact number"
                            value={details.pickupPhone}
                        />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        <SelectInput
                            label="Division"
                            onChange={(value) =>
                                setDetails({
                                    ...details,
                                    pickupDivision: value,
                                    pickupDistrict: '',
                                    pickupUpazila: '',
                                })
                            }
                            options={divisions}
                            placeholder="Select division"
                            value={details.pickupDivision}
                        />
                        <SelectInput
                            label="District"
                            onChange={(value) =>
                                setDetails({
                                    ...details,
                                    pickupDistrict: value,
                                    pickupUpazila: '',
                                })
                            }
                            options={getDistrictsForDivision(details.pickupDivision)}
                            placeholder="Select district"
                            value={details.pickupDistrict}
                        />
                        <SelectInput
                            label="Upazila / Thana"
                            onChange={(value) => setDetails({ ...details, pickupUpazila: value })}
                            options={getUpazilasForDistrict(details.pickupDistrict)}
                            placeholder="Select upazila"
                            value={details.pickupUpazila}
                        />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <TextInput
                            label="Area / Landmark"
                            onChange={(value) => setDetails({ ...details, pickupArea: value })}
                            placeholder="Mirpur 10, near metro station"
                            value={details.pickupArea}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FieldLabel>Full pickup address</FieldLabel>
                        <textarea
                            className="min-h-24 rounded-2xl border border-[#D8CDBB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8173] focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
                            onChange={(event) => setDetails({ ...details, pickupAddress: event.target.value })}
                            placeholder="House, road, building or landmark"
                            value={details.pickupAddress}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FieldLabel>Delivery note (optional)</FieldLabel>
                        <textarea
                            className="min-h-24 rounded-2xl border border-[#D8CDBB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8173] focus:border-[#111827] focus:ring-4 focus:ring-[#7DE3A5]/35"
                            onChange={(event) => setDetails({ ...details, pickupNote: event.target.value })}
                            placeholder="Any instruction for pickup"
                            value={details.pickupNote}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Progress = ({ currentStep, steps }: { currentStep: StepKey; steps: StepKey[] }) => {
    const currentIndex = steps.indexOf(currentStep);

    return (
        <>
            <div className="hidden rounded-full border border-[#D8CDBB] bg-[#FFFDF8] p-2 md:flex">
                {steps.map((step, index) => {
                    const isDone = index < currentIndex;
                    const isCurrent = step === currentStep;

                    return (
                        <div
                            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-extrabold transition ${
                                isCurrent
                                    ? 'bg-[#111827] text-white'
                                    : isDone
                                        ? 'text-[#111827]'
                                        : 'text-[#8A8173]'
                            }`}
                            key={step}
                        >
                            <span
                                className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                                    isCurrent
                                        ? 'bg-white text-[#111827]'
                                        : isDone
                                            ? 'bg-[#7DE3A5] text-[#111827]'
                                            : 'bg-[#D8CDBB] text-[#111827]'
                                }`}
                            >
                                {isDone ? <Check size={14} strokeWidth={2.7} /> : index + 1}
                            </span>
                            {stepLabels[step]}
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-[#D8CDBB] bg-[#FFFDF8] p-4 md:hidden">
                <div className="flex items-center justify-between text-sm font-extrabold text-[#111827]">
                    <span>{stepLabels[currentStep]}</span>
                    <span>
                        Step {currentIndex + 1} of {steps.length}
                    </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D8CDBB]">
                    <div
                        className="h-full rounded-full bg-[#111827] transition-all"
                        style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
            </div>
        </>
    );
};

const photoColors = ['#EAF4EE', '#F4D35E', '#93C5FD', '#A78BFA'];

const createPreviewSellPost = (selectedBook: SelectedBook, details: Details, photos: PhotoPreview[]): SellPost => ({
    id: 'preview-sell-post',
    title: selectedBook.title,
    author: selectedBook.author,
    category: details.category,
    price: Number(details.price),
    priceLabel: `৳${details.price}`,
    condition: details.condition as SellPost['condition'],
    location: details.location,
    sellerName: 'Preview Seller',
    sellerInitials: 'PS',
    sellerColor: '#7DE3A5',
    negotiable: details.negotiable,
    sold: false,
    databaseMatched: Boolean(selectedBook.coverUrl),
    coverUrl: selectedBook.coverUrl,
    coverColor: selectedBook.coverColor,
    photoColors,
    photoUrls: photos.map((photo) => photo.url),
});

const createPreviewExchangePost = (
    selectedBook: SelectedBook,
    wantedBook: SelectedBook,
    details: Details,
    photos: PhotoPreview[],
): ExchangePost => ({
    id: 'preview-exchange-post',
    offeredTitle: selectedBook.title,
    offeredAuthor: selectedBook.author,
    wantedTitle: wantedBook.title,
    wantedAuthor: wantedBook.author,
    category: details.category,
    location: details.location,
    sellerName: 'Preview Seller',
    sellerInitials: 'PS',
    sellerColor: '#7DE3A5',
    exchanged: false,
    offeredCoverUrl: selectedBook.coverUrl,
    wantedCoverUrl: wantedBook.coverUrl,
    offeredCoverColor: selectedBook.coverColor,
    wantedCoverColor: wantedBook.coverColor,
    photoColors,
    photoUrls: photos.map((photo) => photo.url),
});

const createOfficialBookPayload = (book: SelectedBook) =>
    book.source === 'database'
        ? {
              source: 'open-library' as const,
              sourceId: book.sourceId || book.id,
              coverUrl: book.coverUrl,
              title: book.title,
              author: book.author,
              description: book.description,
          }
        : undefined;

const createImagePayload = (image: UploadedImage, alt: string): UploadedImage => ({
    ...image,
    alt,
});

const createPostPayload = ({
    details,
    frontImage,
    photos,
    postType,
    selectedBook,
    wantedBook,
}: {
    details: Details;
    frontImage: UploadedImage;
    photos: UploadedImage[];
    postType: 'sell' | 'exchange';
    selectedBook: SelectedBook;
    wantedBook?: SelectedBook;
}): CreateBookPostPayload => ({
    type: postType,
    title: selectedBook.title,
    author: selectedBook.author,
    category: details.category,
    condition: details.condition,
    officialBook: createOfficialBookPayload(selectedBook),
    frontImage: createImagePayload(frontImage, `${selectedBook.title} front cover`),
    sellerImages: photos.map((photo, index) => createImagePayload(photo, `${selectedBook.title} condition photo ${index + 1}`)),
    price: postType === 'sell' ? Number(details.price) : undefined,
    isNegotiable: postType === 'sell' ? details.negotiable : undefined,
    priceReason: postType === 'sell' ? details.priceReason.trim() : undefined,
    pricingRuleAccepted: postType === 'sell' ? details.pricingRuleAccepted : undefined,
    wantedBook:
        postType === 'exchange' && wantedBook
            ? {
                  title: wantedBook.title,
                  author: wantedBook.author,
                  officialBook: createOfficialBookPayload(wantedBook),
                  frontImage: wantedBook.coverUrl ? { url: wantedBook.coverUrl, alt: `${wantedBook.title} cover` } : undefined,
              }
            : undefined,
    officialDescription: selectedBook.source === 'database' ? selectedBook.description : undefined,
    sellerNote: details.note,
    location: details.location,
    pickupInfo: {
        contactName: details.pickupContactName,
        phone: details.pickupPhone,
        division: details.pickupDivision,
        district: details.pickupDistrict,
        upazila: details.pickupUpazila,
        area: details.pickupArea,
        address: details.pickupAddress,
        note: details.pickupNote,
    },
});

const PreviewStep = ({
    details,
    errorMessage,
    onPublish,
    photos,
    postType,
    publishState,
    selectedBook,
    wantedBook,
}: {
    details: Details;
    errorMessage?: string;
    onPublish: () => void;
    photos: PhotoPreview[];
    postType: PostType;
    publishState: 'idle' | 'loading' | 'success' | 'error';
    selectedBook: SelectedBook;
    wantedBook?: SelectedBook;
}) => (
    <div className="space-y-8">
        <StepHeader
            title="Review your post"
            subtitle="This is how your post will appear before publishing."
        />

        <div className="mx-auto grid max-w-4xl lg:grid-cols-2">
            {postType === 'exchange' && wantedBook ? (
                <div className="lg:col-span-2">
                    <ExchangePostCard
                        isInteractive={false}
                        post={createPreviewExchangePost(selectedBook, wantedBook, details, photos)}
                    />
                </div>
            ) : (
                <SellPostCard isInteractive={false} post={createPreviewSellPost(selectedBook, details, photos)} />
            )}
        </div>

        {publishState === 'success' && (
            <div className="rounded-xl border border-[#A8EBC4] bg-[#E6F8EF] px-4 py-3 text-sm font-extrabold text-[#14532D]">
                Your post is live.
            </div>
        )}

        {publishState === 'error' && (
            <div className="rounded-xl border border-[#FDA29B] bg-[#FFF1F0] px-4 py-3 text-sm font-extrabold text-[#B42318]">
                {errorMessage || 'Could not publish post. Try again.'}
            </div>
        )}

        <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#1F2937] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            disabled={publishState === 'loading'}
            onClick={onPublish}
            type="button"
        >
            {publishState === 'loading' && <Loader2 className="animate-spin" size={18} />}
            {publishState === 'loading' ? 'Publishing...' : 'Confirm & Publish'}
        </button>
    </div>
);

const PostBook = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<StepKey>('book');
    const [selectedBook, setSelectedBook] = useState<SelectedBook>();
    const [wantedBook, setWantedBook] = useState<SelectedBook>();
    const [bookQuery, setBookQuery] = useState('');
    const [wantedQuery, setWantedQuery] = useState('');
    const [manualBook, setManualBook] = useState<ManualBook>(emptyManualBook);
    const [manualWantedBook, setManualWantedBook] = useState<ManualBook>(emptyManualBook);
    const [photos, setPhotos] = useState<PhotoPreview[]>([]);
    const [postType, setPostType] = useState<PostType>('');
    const [details, setDetails] = useState<Details>(emptyDetails);
    const [publishState, setPublishState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [publishError, setPublishError] = useState('');
    const [bookResults, setBookResults] = useState<BookOption[]>([]);
    const [wantedResults, setWantedResults] = useState<BookOption[]>([]);
    const [bookSearchState, setBookSearchState] = useState({ isLoading: false, error: '' });
    const [wantedSearchState, setWantedSearchState] = useState({ isLoading: false, error: '' });

    const steps = useMemo<StepKey[]>(
        () => (postType === 'exchange' ? ['book', 'photos', 'type', 'wanted', 'details', 'preview'] : ['book', 'photos', 'type', 'details', 'preview']),
        [postType],
    );

    const currentIndex = steps.indexOf(currentStep);

    useEffect(() => {
        const query = bookQuery.trim();

        if (query.length < 2 || selectedBook) {
            setBookResults([]);
            setBookSearchState({ isLoading: false, error: '' });
            return;
        }

        let isActive = true;
        setBookSearchState({ isLoading: true, error: '' });

        const timer = window.setTimeout(() => {
            searchOfficialBooks(query)
                .then((response) => {
                    if (!isActive) return;
                    const remoteResults = response.data.map(mapOfficialBookToOption);
                    const localResults = searchLocalBooks(query);
                    const seenIds = new Set(remoteResults.map((book) => book.id));
                    setBookResults([...remoteResults, ...localResults.filter((book) => !seenIds.has(book.id))].slice(0, 6));
                    setBookSearchState({ isLoading: false, error: '' });
                })
                .catch((error) => {
                    if (!isActive) return;
                    setBookResults(searchLocalBooks(query));
                    setBookSearchState({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Book search failed.',
                    });
                });
        }, 350);

        return () => {
            isActive = false;
            window.clearTimeout(timer);
        };
    }, [bookQuery, selectedBook]);

    useEffect(() => {
        const query = wantedQuery.trim();

        if (query.length < 2 || wantedBook) {
            setWantedResults([]);
            setWantedSearchState({ isLoading: false, error: '' });
            return;
        }

        let isActive = true;
        setWantedSearchState({ isLoading: true, error: '' });

        const timer = window.setTimeout(() => {
            searchOfficialBooks(query)
                .then((response) => {
                    if (!isActive) return;
                    const remoteResults = response.data.map(mapOfficialBookToOption);
                    const localResults = searchLocalBooks(query);
                    const seenIds = new Set(remoteResults.map((book) => book.id));
                    setWantedResults([...remoteResults, ...localResults.filter((book) => !seenIds.has(book.id))].slice(0, 6));
                    setWantedSearchState({ isLoading: false, error: '' });
                })
                .catch((error) => {
                    if (!isActive) return;
                    setWantedResults(searchLocalBooks(query));
                    setWantedSearchState({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Book search failed.',
                    });
                });
        }, 350);

        return () => {
            isActive = false;
            window.clearTimeout(timer);
        };
    }, [wantedQuery, wantedBook]);

    const isCurrentValid = () => {
        if (currentStep === 'book') {
            return Boolean(selectedBook);
        }

        if (currentStep === 'photos') {
            return photos.length > 0;
        }

        if (currentStep === 'type') {
            return postType === 'sell' || postType === 'exchange';
        }

        if (currentStep === 'wanted') {
            return Boolean(wantedBook);
        }

        if (currentStep === 'details') {
            const commonValid = Boolean(
                details.category &&
                    details.condition &&
                    details.location.trim() &&
                    details.pickupContactName.trim() &&
                    details.pickupPhone.trim() &&
                    details.pickupDivision.trim() &&
                    details.pickupDistrict.trim() &&
                    details.pickupUpazila.trim() &&
                    details.pickupArea.trim() &&
                    details.pickupAddress.trim(),
            );

            if (postType === 'sell') {
                return commonValid && Number(details.price) > 0 && details.pricingRuleAccepted;
            }

            return commonValid;
        }

        return true;
    };

    const nextStep = () => {
        if (!isCurrentValid()) {
            return;
        }

        const next = steps[currentIndex + 1];

        if (next) {
            setCurrentStep(next);
        }
    };

    const previousStep = () => {
        const previous = steps[currentIndex - 1];

        if (previous) {
            setCurrentStep(previous);
        }
    };

    const handlePostType = (type: PostType) => {
        setPostType(type);

        if (type === 'sell') {
            setWantedBook(undefined);
        }
    };

    const handlePublish = async () => {
        if (!selectedBook || (postType === 'exchange' && !wantedBook) || (postType !== 'sell' && postType !== 'exchange')) {
            setPublishState('error');
            setPublishError('Complete required fields before publishing.');
            return;
        }

        setPublishState('loading');
        setPublishError('');

        try {
            const frontCoverFile = selectedBook.source === 'manual' ? manualBook.frontCoverFile : undefined;
            const frontImage =
                frontCoverFile
                    ? (await uploadImages([frontCoverFile])).data[0]
                    : selectedBook.coverUrl
                        ? { url: selectedBook.coverUrl, alt: `${selectedBook.title} cover` }
                        : undefined;

            if (!frontImage) {
                throw new Error('Front image is required.');
            }

            const uploadedPhotos = (await uploadImages(photos.map((photo) => photo.file))).data;
            const payload = createPostPayload({
                details,
                frontImage,
                photos: uploadedPhotos,
                postType,
                selectedBook,
                wantedBook,
            });
            const response = await createBookPost(payload);

            setPublishState('success');
            navigate(`/books/${response.data._id}`, { replace: true });
        } catch (error) {
            setPublishState('error');
            setPublishError(error instanceof Error ? error.message : 'Could not publish post. Try again.');
        }
    };

    return (
        <main className="bg-[#FAF7EF] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-[1180px]">
                <header className="max-w-3xl">
                    <p className="inline-flex rounded-full border border-[#D8CDBB] bg-[#FFFDF8] px-4 py-2 text-sm font-extrabold text-[#111827]">
                        Share a book
                    </p>
                    <h1 className="font-sora mt-5 text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl">
                        Post a Book
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-[#5F6675]">
                        Add your book details, choose how you want to share it, and preview before publishing.
                    </p>
                </header>

                <div className="mt-8">
                    <Progress currentStep={currentStep} steps={steps} />
                </div>

                <div className="mt-8">
                    <section className="rounded-2xl border border-[#D8CDBB] bg-[#FFFDF8] p-5 shadow-[0_12px_34px_rgba(17,24,39,0.05)] sm:p-8">
                        {currentStep === 'book' && (
                            <BookSearchStep
                                errorMessage={bookSearchState.error}
                                isSearching={bookSearchState.isLoading}
                                manual={manualBook}
                                manualButtonLabel="Add manually"
                                onManualChange={setManualBook}
                                onSelect={setSelectedBook}
                                query={bookQuery}
                                requireFrontCover
                                results={bookResults}
                                searchPlaceholder="Search by book title"
                                selected={selectedBook}
                                selectedBadge="Selected book"
                                setQuery={setBookQuery}
                                subtitle="Search the book database or add the book manually."
                                title="Which book are you posting?"
                            />
                        )}

                        {currentStep === 'photos' && <PhotosStep photos={photos} setPhotos={setPhotos} />}

                        {currentStep === 'type' && <TypeStep postType={postType} setPostType={handlePostType} />}

                        {currentStep === 'wanted' && (
                            <BookSearchStep
                                errorMessage={wantedSearchState.error}
                                isSearching={wantedSearchState.isLoading}
                                manual={manualWantedBook}
                                manualButtonLabel="Add manually"
                                onManualChange={setManualWantedBook}
                                onSelect={setWantedBook}
                                query={wantedQuery}
                                results={wantedResults}
                                searchPlaceholder="Search wanted book title"
                                selected={wantedBook}
                                selectedBadge="Wanted book"
                                setQuery={setWantedQuery}
                                subtitle="Search the book database or add the wanted book manually."
                                title="Which book do you want in exchange?"
                            />
                        )}

                        {currentStep === 'details' && (
                            <DetailsStep details={details} postType={postType} setDetails={setDetails} />
                        )}

                        {currentStep === 'preview' && selectedBook && (
                            <PreviewStep
                                details={details}
                                errorMessage={publishError}
                                onPublish={handlePublish}
                                photos={photos}
                                postType={postType}
                                publishState={publishState}
                                selectedBook={selectedBook}
                                wantedBook={wantedBook}
                            />
                        )}

                        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#E8DFD1] pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8CDBB] bg-white px-6 py-3 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6] disabled:cursor-not-allowed disabled:opacity-40"
                                disabled={currentIndex === 0}
                                onClick={previousStep}
                                type="button"
                            >
                                <ArrowLeft size={17} strokeWidth={2.4} />
                                Back
                            </button>

                            {currentStep !== 'preview' && (
                                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                                    {!isCurrentValid() && (
                                        <p className="text-center text-sm font-bold text-[#8A8173] sm:text-right">
                                            Complete required fields to continue.
                                        </p>
                                    )}
                                    <button
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-45"
                                        disabled={!isCurrentValid()}
                                        onClick={nextStep}
                                        type="button"
                                    >
                                        Continue
                                        <ArrowRight size={17} strokeWidth={2.4} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default PostBook;
