import { BookOpen, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DonationPost } from './data/donationPosts';

const slugifyDonorName = (name: string) => name.toLowerCase().replaceAll(' ', '-');

const DonorAvatar = ({ post }: { post: DonationPost }) => (
    <Link
        className="group/avatar absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border-2 border-white text-xs font-extrabold text-[#111827] shadow-[0_8px_20px_rgba(17,24,39,0.16)]"
        to={`/profile/${slugifyDonorName(post.donorName)}`}
        style={{ backgroundColor: post.donorColor }}
        aria-label={`View ${post.donorName}'s profile`}
    >
        {post.donorInitials}
        <span className="pointer-events-none absolute right-0 top-12 hidden whitespace-nowrap rounded-md bg-[#111827] px-3 py-1.5 text-xs font-bold text-white group-hover/avatar:block">
            {post.donorName}
        </span>
    </Link>
);

const DonationCover = ({ post }: { post: DonationPost }) => (
    <div className="relative bg-[#F7F4EC] p-4">
        <div className="aspect-[4/5] overflow-hidden rounded-md border-2 border-[#111827] bg-[#FFFDF8]">
            {post.coverUrl ? (
                <img
                    className="h-full w-full object-cover"
                    src={post.coverUrl}
                    alt={`${post.title} cover`}
                    loading="lazy"
                />
            ) : (
                <div
                    className="relative flex h-full flex-col justify-between overflow-hidden p-5"
                    style={{ backgroundColor: post.coverColor }}
                >
                    <div
                        className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-80"
                        style={{ backgroundColor: post.accentColor }}
                    />
                    <div className="relative">
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#111827]/60">
                            Donation
                        </p>
                        <h4 className="font-sora mt-4 max-w-[150px] text-2xl font-extrabold leading-tight text-[#111827]">
                            {post.title}
                        </h4>
                    </div>
                    <BookOpen className="relative text-[#111827]" size={40} strokeWidth={1.8} />
                </div>
            )}
        </div>
    </div>
);

const DonationCard = ({ post }: { post: DonationPost }) => (
    <article className="group relative flex h-full min-h-[460px] flex-col overflow-hidden rounded-lg border border-[#D6CCBA] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(17,24,39,0.12)]">
        <DonorAvatar post={post} />
        <DonationCover post={post} />

        <div className="flex flex-1 flex-col p-5 text-left">
            <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#92400E]">
                    Donation
                </span>
                <span className="rounded-full bg-[#EEE8DC] px-3 py-1 text-xs font-bold text-[#374151]">
                    {post.condition}
                </span>
            </div>

            <h3 className="font-sora mt-4 line-clamp-2 text-xl font-extrabold leading-tight text-[#111827]">
                {post.title}
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#4F5865]">{post.author}</p>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#D6CCBA] pt-4">
                <span className="rounded-full bg-[#EAF4EE] px-3 py-1 text-xs font-extrabold text-[#166534]">
                    Free Donation
                </span>
                <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-[#626B78]">
                    <MapPin className="shrink-0" size={14} strokeWidth={2.2} />
                    <span className="truncate">{post.location}</span>
                </p>
            </div>
        </div>
    </article>
);

export default DonationCard;
