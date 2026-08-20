import { BookOpen, Image, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export type BookPostType = 'For Sale' | 'Exchange' | 'Donation';

export type CompactBook = {
    id: string;
    title: string;
    author: string;
    type: BookPostType;
    condition: 'New' | 'Used' | 'Good' | 'Fair';
    priceLabel: string;
    location: string;
    coverColor: string;
    accentColor: string;
    coverLabel: string;
    coverMeta: string;
    posterUrl?: string;
    hasDatabaseMatch: boolean;
};

const postTypeStyles = {
    'For Sale': 'bg-[#EAF4EE] text-[#166534]',
    Exchange: 'bg-[#EAF2FF] text-[#1D4ED8]',
    Donation: 'bg-[#FFF3D6] text-[#92400E]',
};

const CompactBookCard = ({
    book,
    size = 'default',
    to = '/buy-sell',
}: {
    book: CompactBook;
    size?: 'default' | 'compact';
    to?: string;
}) => {
    const isCompact = size === 'compact';

    return (
        <Link
            className="group block overflow-hidden rounded-lg border border-[#E7DFD0] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(17,24,39,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
            to={to}
        >
            <div className={`relative bg-[#F7F4EC] ${isCompact ? 'p-3' : 'p-4'}`}>
                <div
                    className={`aspect-[4/5] rounded-md border border-[#E7DFD0] bg-[#FFFDF8] ${
                        isCompact ? 'p-3' : 'p-4'
                    }`}
                >
                    {book.posterUrl ? (
                        <img
                            className="h-full w-full rounded-sm border-2 border-[#111827] object-cover"
                            src={book.posterUrl}
                            alt={`${book.title} book cover`}
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className={`relative flex h-full flex-col justify-between overflow-hidden rounded-sm border-2 border-[#111827] ${
                                isCompact ? 'p-3' : 'p-4'
                            }`}
                            style={{ backgroundColor: book.coverColor }}
                        >
                            <div
                                className={`absolute rounded-full opacity-80 ${
                                    isCompact ? '-right-7 -top-7 h-24 w-24' : '-right-8 -top-8 h-28 w-28'
                                }`}
                                style={{ backgroundColor: book.accentColor }}
                            />
                            <div className="relative">
                                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#111827]/60">
                                    {book.coverMeta}
                                </p>
                                <h4
                                    className={`font-sora mt-4 max-w-[150px] font-extrabold leading-tight text-[#111827] ${
                                        isCompact ? 'text-xl' : 'text-2xl'
                                    }`}
                                >
                                    {book.coverLabel}
                                </h4>
                            </div>
                            <div className="relative flex items-end justify-between">
                                {book.hasDatabaseMatch ? (
                                    <BookOpen className="text-[#111827]" size={40} strokeWidth={1.8} />
                                ) : (
                                    <Image className="text-[#111827]" size={38} strokeWidth={1.8} />
                                )}
                                <div
                                    className="h-16 w-8 rounded-sm border-2 border-[#111827]"
                                    style={{ backgroundColor: book.accentColor }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute left-7 top-7 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${postTypeStyles[book.type]}`}>
                        {book.type}
                    </span>
                </div>
                <span className="absolute right-7 top-7 rounded-full border border-[#E7DFD0] bg-[#F4EFE6] px-3 py-1 text-xs font-bold text-[#5F6673]">
                    {book.condition}
                </span>
            </div>

            <div className={`${isCompact ? 'p-4' : 'p-5'} text-left`}>
                <div className={isCompact ? 'min-h-[64px]' : 'min-h-[76px]'}>
                    <h3
                        className={`font-sora line-clamp-2 font-bold leading-snug text-[#111827] ${
                            isCompact ? 'text-base' : 'text-lg'
                        }`}
                    >
                        {book.title}
                    </h3>
                    <p className="mt-2 line-clamp-1 text-sm font-medium text-[#5F6673]">{book.author}</p>
                </div>

                <div
                    className={`flex items-center justify-between gap-3 border-t border-[#E7DFD0] ${
                        isCompact ? 'mt-3 pt-3' : 'mt-5 pt-4'
                    }`}
                >
                    <p className="font-sora text-base font-extrabold text-[#111827]">{book.priceLabel}</p>
                    <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-[#7A7280]">
                        <MapPin className="shrink-0" size={14} strokeWidth={2.2} />
                        <span className="truncate">{book.location}</span>
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default CompactBookCard;
