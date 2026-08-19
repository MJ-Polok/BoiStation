import { BookOpen, MapPin, Repeat2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ExchangePost } from './data/exchangePosts';

const MiniCover = ({
    title,
    color,
    imageUrl,
}: {
    title: string;
    color: string;
    imageUrl?: string;
}) => (
    <div className="h-36 w-28 overflow-hidden rounded-md border-2 border-[#111827] bg-[#FFFDF8] shadow-[6px_6px_0_rgba(17,24,39,0.10)]">
        {imageUrl ? (
            <img className="h-full w-full object-cover" src={imageUrl} alt={`${title} cover`} loading="lazy" />
        ) : (
            <div className="flex h-full flex-col justify-between p-3" style={{ backgroundColor: color }}>
                <h4 className="font-sora line-clamp-3 text-sm font-extrabold leading-tight text-[#111827]">
                    {title}
                </h4>
                <BookOpen size={28} strokeWidth={1.8} />
            </div>
        )}
    </div>
);

const PhotoTile = ({
    color,
    imageUrl,
    index,
    extraCount,
}: {
    color: string;
    imageUrl?: string;
    index: number;
    extraCount?: number;
}) => (
    <div
        className="relative aspect-[4/3] min-h-20 overflow-hidden rounded-md border border-[#D6CCBA]"
        style={{ backgroundColor: color }}
    >
        {imageUrl ? (
            <img className="absolute inset-0 h-full w-full object-cover" src={imageUrl} alt={`Seller photo ${index + 1}`} />
        ) : (
            <>
                <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-white/45" />
                <div className="absolute bottom-3 left-3 h-8 w-14 rounded-sm border-2 border-[#111827] bg-[#FFFDF8]" />
                <div className="absolute bottom-3 right-3 h-12 w-6 rounded-sm border-2 border-[#111827] bg-white/60" />
            </>
        )}
        {extraCount ? (
            <div className="absolute inset-0 grid place-items-center bg-[#111827]/55 text-sm font-extrabold text-white">
                +{extraCount}
            </div>
        ) : !imageUrl ? (
            <span className="sr-only">Seller photo {index + 1}</span>
        ) : null}
    </div>
);

const SellerAvatar = ({ post }: { post: ExchangePost }) => (
    <span
        className="group/avatar absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border-2 border-white text-xs font-extrabold text-[#111827] shadow-[0_8px_20px_rgba(17,24,39,0.16)]"
        style={{ backgroundColor: post.sellerColor }}
        aria-label={`View ${post.sellerName}'s profile`}
    >
        {post.sellerInitials}
        <span className="pointer-events-none absolute right-0 top-12 hidden whitespace-nowrap rounded-md bg-[#111827] px-3 py-1.5 text-xs font-bold text-white group-hover/avatar:block">
            {post.sellerName}
        </span>
    </span>
);

const PosterBox = ({ post }: { post: ExchangePost }) => (
    <div className="relative min-h-[280px] rounded-lg bg-[#F7F4EC] p-5">
        <div className="absolute left-5 top-5">
            <MiniCover
                color={post.offeredCoverColor}
                imageUrl={post.offeredCoverUrl}
                title={post.offeredTitle}
            />
        </div>
        <div className="absolute bottom-5 right-5">
            <MiniCover
                color={post.wantedCoverColor}
                imageUrl={post.wantedCoverUrl}
                title={post.wantedTitle}
            />
        </div>
        <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#111827] text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)]">
            <Repeat2 size={25} strokeWidth={2.5} />
        </div>
    </div>
);

type ExchangePostCardProps = {
    post: ExchangePost;
    isInteractive?: boolean;
};

const ExchangeCardBody = ({ post }: { post: ExchangePost }) => (
        <article className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg border border-[#D6CCBA] bg-white p-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-[0_16px_38px_rgba(17,24,39,0.12)]">
            <SellerAvatar post={post} />
            <div className="grid flex-1 gap-4 lg:grid-cols-[0.9fr_1fr]">
                <PosterBox post={post} />

                <div className="flex flex-col rounded-lg border border-[#E7DFD0] bg-[#FAF8F2] p-4">
                    <div className="pr-12">
                        <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-bold text-[#1D4ED8]">
                            Exchange
                        </span>
                        <div className="mt-4 space-y-4">
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#626B78]">
                                    Offering
                                </p>
                                <h3 className="font-sora mt-1 line-clamp-2 text-xl font-extrabold leading-tight text-[#111827]">
                                    {post.offeredTitle}
                                </h3>
                                <p className="mt-1 text-sm font-semibold text-[#4F5865]">{post.offeredAuthor}</p>
                            </div>
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#626B78]">
                                    Wants
                                </p>
                                <h3 className="font-sora mt-1 line-clamp-2 text-xl font-extrabold leading-tight text-[#111827]">
                                    {post.wantedTitle}
                                </h3>
                                <p className="mt-1 text-sm font-semibold text-[#4F5865]">{post.wantedAuthor}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 grid flex-1 grid-cols-2 gap-2.5">
                        {(post.photoUrls?.length ? post.photoUrls : post.photoColors).slice(0, 4).map((item, index) => (
                            <PhotoTile
                                color={post.photoColors[index] || '#F7F4EC'}
                                imageUrl={post.photoUrls?.[index]}
                                extraCount={index === 3 && (post.photoUrls?.length || post.photoColors.length) > 4 ? (post.photoUrls?.length || post.photoColors.length) - 3 : undefined}
                                index={index}
                                key={`${post.id}-${item}-${index}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#D6CCBA] pt-4">
                <p className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[#626B78]">
                    <MapPin className="shrink-0" size={15} strokeWidth={2.2} />
                    <span className="truncate">{post.location}</span>
                </p>
            </div>
        </article>
);

const ExchangePostCard = ({ isInteractive = true, post }: ExchangePostCardProps) => {
    const card = <ExchangeCardBody post={post} />;

    if (!isInteractive) {
        return <div className="group/card block h-full">{card}</div>;
    }

    return (
        <Link className="group/card block h-full" to={`/books/${post.id}`}>
            {card}
        </Link>
    );
};

export default ExchangePostCard;
