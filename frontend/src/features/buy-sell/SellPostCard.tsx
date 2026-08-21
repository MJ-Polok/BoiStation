import { BookOpen, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SellPost } from './data/sellPosts';

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
        className="relative aspect-[4/3] min-h-20 w-full min-w-0 max-w-full overflow-hidden rounded-md border border-[#D6CCBA]"
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

const SellerAvatar = ({ post }: { post: SellPost; }) => (
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

const PriceFooter = ({ post }: { post: SellPost; }) => (
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#D6CCBA] pt-4">
        <div className="flex min-w-0 items-center gap-2">
            <p className="font-sora text-lg font-extrabold text-[#111827]">{post.priceLabel}</p>
            {post.negotiable && (
                <span className="rounded-full bg-[#FFE8A3] px-3 py-1 text-xs font-bold text-[#7C2D12]">
                    Negotiable
                </span>
            )}
        </div>
        <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-[#626B78]">
            <MapPin className="shrink-0" size={14} strokeWidth={2.2} />
            <span className="truncate">{post.location}</span>
        </p>
    </div>
);

const OfficialCover = ({ post }: { post: SellPost; }) => (
    <div className="w-full min-w-0 max-w-full rounded-lg bg-[#F7F4EC] p-4">
        <div className="aspect-[4/5] w-full min-w-0 max-w-full overflow-hidden rounded-md border-2 border-[#111827] bg-[#FFFDF8]">
            {post.coverUrl ? (
                <img
                    className="h-full w-full object-cover"
                    src={post.coverUrl}
                    alt={`${post.title} official cover`}
                    loading="lazy"
                />
            ) : (
                <div
                    className="flex h-full flex-col justify-between p-5"
                    style={{ backgroundColor: post.coverColor }}
                >
                    <h4 className="font-sora text-2xl font-extrabold leading-tight text-[#111827]">{post.title}</h4>
                    <BookOpen size={42} strokeWidth={1.8} />
                </div>
            )}
        </div>
    </div>
);

const MatchedSellCard = ({ post }: { post: SellPost; }) => (
    <article className="group relative flex h-full min-h-[360px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-lg border border-[#D6CCBA] bg-white p-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-[0_16px_38px_rgba(17,24,39,0.12)]">
        <SellerAvatar post={post} />
        <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
            <OfficialCover post={post} />
            <div className="flex min-w-0 flex-col rounded-lg border border-[#E7DFD0] bg-[#FAF8F2] p-4">
                <div className="pr-12">
                    <span className="rounded-full bg-[#EAF4EE] px-3 py-1 text-xs font-bold text-[#14532D]">
                        For Sale
                    </span>
                    <h3 className="font-sora mt-4 line-clamp-2 text-2xl font-extrabold leading-tight text-[#111827]">
                        {post.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[#4F5865]">{post.author}</p>
                </div>

                <div className="mt-5 grid min-w-0 flex-1 grid-cols-2 gap-2.5">
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
        <PriceFooter post={post} />
        {post.sold && <SoldOverlay />}
    </article>
);

const FallbackSellCard = ({ post }: { post: SellPost; }) => (
    <article className="group relative flex h-full min-h-[360px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-lg border border-[#D6CCBA] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-[0_16px_38px_rgba(17,24,39,0.12)]">
        <SellerAvatar post={post} />
        <div className="relative bg-[#F7F4EC] p-4">
            <div className="h-[220px] overflow-hidden rounded-md border-2 border-[#111827] sm:h-[240px] lg:h-[220px]">
                <PhotoTile color={post.photoColors[0]} imageUrl={post.photoUrls?.[0]} index={0} />
            </div>
            <button
                className="absolute left-7 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#111827] shadow"
                type="button"
                aria-label="Previous photo"
            >
                <ChevronLeft size={17} strokeWidth={2.4} />
            </button>
            <button
                className="absolute right-7 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#111827] shadow"
                type="button"
                aria-label="Next photo"
            >
                <ChevronRight size={17} strokeWidth={2.4} />
            </button>
        </div>

        <div className="flex flex-1 flex-col p-5 text-left">
            <span className="rounded-full bg-[#EEE8DC] px-3 py-1 text-xs font-bold text-[#374151]">
                Seller Photos
            </span>
            <h3 className="font-sora mt-4 line-clamp-2 text-xl font-extrabold leading-tight text-[#111827]">
                {post.title}
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#4F5865]">{post.author}</p>
            <div className="mt-auto">
                <PriceFooter post={post} />
            </div>
        </div>
        {post.sold && <SoldOverlay />}
    </article>
);

const SoldOverlay = () => (
    <div className="absolute inset-0 z-20 grid place-items-center bg-[#111827]/70">
        <span className="rounded-full bg-[#FEE2E2] px-5 py-2 text-sm font-extrabold text-[#991B1B]">
            Sold
        </span>
    </div>
);

type SellPostCardProps = {
    post: SellPost;
    isInteractive?: boolean;
};

const SellPostCard = ({ isInteractive = true, post }: SellPostCardProps) => {
    const wrapperClass = 'group/card block h-full w-full min-w-0 max-w-full';

    if (post.databaseMatched) {
        const card = <MatchedSellCard post={post} />;

        if (!isInteractive) {
            return <div className={`${wrapperClass} lg:col-span-2`}>{card}</div>;
        }

        return (
            <Link className={`${wrapperClass} lg:col-span-2`} to={`/books/${post.id}`}>
                {card}
            </Link>
        );
    }

    const card = <FallbackSellCard post={post} />;

    if (!isInteractive) {
        return <div className={wrapperClass}>{card}</div>;
    }

    return (
        <Link className={wrapperClass} to={`/books/${post.id}`}>
            {card}
        </Link>
    );
};

export default SellPostCard;
