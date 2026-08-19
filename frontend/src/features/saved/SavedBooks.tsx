import { ArrowRight, BookOpen, Bookmark, MapPin, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SavedBook } from './data/savedBooks';
import { listSavedBooks, mapBackendSavedBook, removeSavedBook as removeSavedBookRequest } from './api';

const typeStyles = {
    'For Sale': 'bg-[#EAF4EE] text-[#14532D]',
    Exchange: 'bg-[#EAF2FF] text-[#1D4ED8]',
};

const CoverThumb = ({ book }: { book: SavedBook }) => (
    <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-md border border-[#E8DFD1] bg-[#F7F4EC] p-2 sm:h-40 sm:w-32">
        {book.coverUrl ? (
            <img
                className="h-full w-full rounded-sm border-2 border-[#111827] object-cover"
                src={book.coverUrl}
                alt={`${book.title} cover`}
                loading="lazy"
            />
        ) : (
            <div
                className="relative flex h-full flex-col justify-between overflow-hidden rounded-sm border-2 border-[#111827] p-3"
                style={{ backgroundColor: book.coverColor }}
            >
                <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-80"
                    style={{ backgroundColor: book.accentColor }}
                />
                <div className="relative">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#111827]/60">
                        {book.category}
                    </p>
                    <h3 className="font-sora mt-3 line-clamp-4 text-base font-extrabold leading-tight text-[#111827]">
                        {book.title}
                    </h3>
                </div>
                <BookOpen className="relative text-[#111827]" size={28} strokeWidth={1.9} />
            </div>
        )}
    </div>
);

const SavedRow = ({ book, onRemove }: { book: SavedBook; onRemove: (id: string) => void }) => (
    <article className="grid gap-5 border-b border-[#E8DFD1] bg-[#FFFDF8] px-4 py-6 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
            <CoverThumb book={book} />
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${typeStyles[book.type]}`}>
                        {book.type}
                    </span>
                    <span className="rounded-full border border-[#E7DFD0] bg-[#F4EFE6] px-3 py-1 text-xs font-extrabold text-[#5F6673]">
                        {book.condition}
                    </span>
                    <span className="rounded-full bg-[#FFE8A3] px-3 py-1 text-xs font-extrabold text-[#7C4A03]">
                        {book.priceLabel}
                    </span>
                </div>

                <h2 className="font-sora mt-4 line-clamp-2 text-2xl font-extrabold leading-tight text-[#111827]">
                    {book.title}
                </h2>
                <p className="mt-2 text-sm font-bold text-[#626B78]">{book.author}</p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-[#626B78]">
                    <span>{book.category}</span>
                    <span className="flex items-center gap-1.5">
                        <MapPin size={15} strokeWidth={2.3} />
                        {book.location}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-stretch sm:justify-center">
            <Link
                className="inline-flex min-w-32 items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                to={`/books/${book.id}`}
            >
                View Details
                <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
            <button
                className="inline-flex min-w-32 items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-white px-5 py-3 text-sm font-extrabold text-[#626B78] transition hover:bg-[#F4EFE6] hover:text-[#111827]"
                onClick={() => onRemove(book.id)}
                type="button"
            >
                <Trash2 size={16} strokeWidth={2.4} />
                Remove
            </button>
        </div>
    </article>
);

const SavedBooks = () => {
    const [visibleBooks, setVisibleBooks] = useState<SavedBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [removeError, setRemoveError] = useState('');

    useEffect(() => {
        let isActive = true;

        setIsLoading(true);
        setLoadError('');

        listSavedBooks()
            .then((response) => {
                if (!isActive) return;

                setVisibleBooks(response.data.map(mapBackendSavedBook).filter(Boolean) as SavedBook[]);
            })
            .catch((error) => {
                if (!isActive) return;

                setVisibleBooks([]);
                setLoadError(error instanceof Error ? error.message : 'Could not load saved books.');
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    const counts = useMemo(
        () => ({
            total: visibleBooks.length,
            sell: visibleBooks.filter((book) => book.type === 'For Sale').length,
            exchange: visibleBooks.filter((book) => book.type === 'Exchange').length,
        }),
        [visibleBooks],
    );

    const removeSavedBook = async (id: string) => {
        setRemoveError('');

        try {
            await removeSavedBookRequest(id);
            setVisibleBooks((books) => books.filter((book) => book.id !== id));
        } catch (error) {
            setRemoveError(error instanceof Error ? error.message : 'Could not remove this saved book.');
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[#FBF8F1] px-4 py-8 text-[#111827] sm:px-6 lg:px-8 lg:py-12">
                <div className="mx-auto max-w-7xl rounded-lg border border-[#D6CCBA] bg-white p-8 shadow-[0_14px_34px_rgba(17,24,39,0.04)]">
                    <div className="h-8 w-40 animate-pulse rounded-full bg-[#F0E7D8]" />
                    <div className="mt-8 h-64 animate-pulse rounded-lg bg-[#F7F4EC]" />
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#FBF8F1] px-4 py-8 text-[#111827] sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 border-b border-[#D6CCBA] pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#8A8173]">
                            Your Library
                        </p>
                        <h1 className="font-sora mt-2 text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl">
                            Saved Books
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-[#626B78]">
                            Books you saved to check later.
                        </p>
                    </div>
                    <Link
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-5 py-3 text-sm font-extrabold text-[#111827] transition hover:border-[#111827] lg:self-center"
                        to="/buy-sell"
                    >
                        Browse Books
                        <ArrowRight size={17} strokeWidth={2.4} />
                    </Link>
                </div>

                {loadError ? (
                    <p className="mt-5 rounded-lg border border-[#FCD34D] bg-[#FFF7D8] px-4 py-3 text-sm font-bold text-[#7C4A03]">
                        {loadError}
                    </p>
                ) : null}
                {removeError ? (
                    <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        {removeError}
                    </p>
                ) : null}

                {visibleBooks.length > 0 ? (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                        <section className="overflow-hidden rounded-lg border border-[#D6CCBA] bg-[#FFFDF8] shadow-[0_14px_34px_rgba(17,24,39,0.04)]">
                            {visibleBooks.map((book) => (
                                <SavedRow book={book} key={book.id} onRemove={removeSavedBook} />
                            ))}
                        </section>

                        <aside className="rounded-lg border border-[#D6CCBA] bg-white p-6 shadow-[0_14px_34px_rgba(17,24,39,0.05)] lg:sticky lg:top-28">
                            <div className="flex items-center gap-3 border-b border-[#E8DFD1] pb-5">
                                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF4EE] text-[#14532D]">
                                    <Bookmark size={20} strokeWidth={2.4} />
                                </span>
                                <div>
                                    <h2 className="font-sora text-2xl font-extrabold text-[#111827]">
                                        Saved Summary
                                    </h2>
                                    <p className="text-sm font-bold text-[#626B78]">Your saved book overview.</p>
                                </div>
                            </div>

                            <div className="grid gap-3 py-5">
                                <div className="flex items-center justify-between rounded-md border border-[#E8DFD1] bg-[#FFFDF8] p-4">
                                    <span className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#8A8173]">
                                        Total Saved
                                    </span>
                                    <span className="font-sora text-2xl font-extrabold">{counts.total}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-md border border-[#E8DFD1] bg-[#FFFDF8] p-4">
                                    <span className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#8A8173]">
                                        For Sale
                                    </span>
                                    <span className="font-sora text-2xl font-extrabold">{counts.sell}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-md border border-[#E8DFD1] bg-[#FFFDF8] p-4">
                                    <span className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#8A8173]">
                                        Exchange
                                    </span>
                                    <span className="font-sora text-2xl font-extrabold">{counts.exchange}</span>
                                </div>
                            </div>

                            <Link
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                                to="/buy-sell"
                            >
                                Browse Books
                                <ArrowRight size={17} strokeWidth={2.4} />
                            </Link>
                        </aside>
                    </div>
                ) : (
                    <section className="mt-8 rounded-lg border border-[#D6CCBA] bg-white p-8 text-center shadow-[0_14px_34px_rgba(17,24,39,0.04)]">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EAF4EE] text-[#14532D]">
                            <Bookmark size={24} strokeWidth={2.4} />
                        </div>
                        <h2 className="font-sora mt-5 text-3xl font-extrabold text-[#111827]">No saved books yet</h2>
                        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-[#626B78]">
                            Save books you like and find them here later.
                        </p>
                        <Link
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                            to="/buy-sell"
                        >
                            Browse Books
                            <ArrowRight size={17} strokeWidth={2.4} />
                        </Link>
                    </section>
                )}
            </div>
        </main>
    );
};

export default SavedBooks;
