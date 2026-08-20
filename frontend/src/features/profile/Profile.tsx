import { ArrowLeft, BookOpen, Edit3, Mail, MapPin, Plus, Repeat2, Save, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import CompactBookCard, { type CompactBook } from '../../components/ui/CompactBookCard';
import { createLoginRedirect } from '../../lib/auth';
import { useMockAuth } from '../../hooks/useMockAuth';
import type { BackendBookPost } from '../book-details/api';
import {
    getProfile,
    getProfilePosts as getBackendProfilePosts,
    removeMyBookPost,
    updateMyProfile,
    type BackendProfileUser,
} from './api';

type ProfileTab = 'all' | 'sell' | 'exchange';

type ViewProfile = {
    id: string;
    name: string;
    username?: string;
    initials: string;
    avatarColor: string;
    avatarUrl?: string;
    area: string;
    bio?: string;
    joinedLabel: string;
};

type ViewPost = {
    id: string;
    type: 'sell' | 'exchange';
    title: string;
    author: string;
    condition: string;
    location: string;
    coverUrl?: string;
    coverColor: string;
    priceLabel?: string;
};

const tabs: { id: ProfileTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'sell', label: 'Sell' },
    { id: 'exchange', label: 'Exchange' },
];

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'BS';

const formatJoinedLabel = (date?: string) => {
    if (!date) return 'Joined 2026';

    const year = new Date(date).getFullYear();
    return Number.isNaN(year) ? 'Joined 2026' : `Joined ${year}`;
};

const mapBackendProfile = (user: BackendProfileUser): ViewProfile => ({
    id: user.username || user.id || user._id || '',
    name: user.name,
    username: user.username,
    initials: getInitials(user.name),
    avatarColor: '#7DE3A5',
    avatarUrl: user.avatar?.url,
    area: user.location || 'Location not set',
    bio: user.bio || 'Sharing books with readers on Boi Station.',
    joinedLabel: formatJoinedLabel(user.createdAt),
});

const mapBackendPost = (post: BackendBookPost): ViewPost => ({
    id: post._id,
    type: post.type === 'exchange' ? 'exchange' : 'sell',
    title: post.type === 'exchange' ? post.title : post.title,
    author: post.author,
    condition: post.condition,
    location: post.location,
    coverUrl: post.officialBook?.coverUrl || post.frontImage?.url,
    coverColor: '#F7F2E8',
    priceLabel: post.type === 'sell' ? `৳${post.price || 0}` : 'Exchange',
});

const mapProfilePostToCompactBook = (post: ViewPost): CompactBook => ({
    id: post.id,
    title: post.title,
    author: post.author,
    type: post.type === 'sell' ? 'For Sale' : 'Exchange',
    condition: post.condition as CompactBook['condition'],
    priceLabel: post.priceLabel || (post.type === 'sell' ? 'For Sale' : 'Exchange'),
    location: post.location,
    coverColor: post.coverColor,
    accentColor: post.type === 'sell' ? '#7DE3A5' : '#93C5FD',
    coverLabel: post.title,
    coverMeta: post.type === 'sell' ? 'Book Post' : 'Exchange',
    posterUrl: post.coverUrl,
    hasDatabaseMatch: Boolean(post.coverUrl),
});

const Profile = () => {
    const { id } = useParams();
    const { currentUser, isAuthenticated } = useMockAuth();
    const [profile, setProfile] = useState<ViewProfile | undefined>();
    const [posts, setPosts] = useState<ViewPost[]>([]);
    const [activeTab, setActiveTab] = useState<ProfileTab>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [removingPostId, setRemovingPostId] = useState('');
    const [formError, setFormError] = useState('');
    const [removeError, setRemoveError] = useState('');
    const [editForm, setEditForm] = useState({
        name: '',
        username: '',
        location: '',
        bio: '',
    });

    useEffect(() => {
        if (!id) return;

        let isActive = true;
        setIsLoading(true);
        setError('');
        setIsEditing(false);

        Promise.all([getProfile(id), getBackendProfilePosts(id)])
            .then(([profileResponse, postsResponse]) => {
                if (!isActive) return;

                setProfile(mapBackendProfile(profileResponse.data));
                setPosts(postsResponse.data.map(mapBackendPost));
            })
            .catch(() => {
                if (!isActive) return;

                setProfile(undefined);
                setPosts([]);
                setError('Profile not found');
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [id]);

    useEffect(() => {
        if (!profile) return;

        setEditForm({
            name: profile.name,
            username: profile.username || profile.id,
            location: profile.area === 'Location not set' ? '' : profile.area,
            bio: profile.bio || '',
        });
    }, [profile]);

    const filteredPosts = useMemo(
        () => (activeTab === 'all' ? posts : posts.filter((post) => post.type === activeTab)),
        [activeTab, posts],
    );

    const sellCount = posts.filter((post) => post.type === 'sell').length;
    const exchangeCount = posts.filter((post) => post.type === 'exchange').length;
    const isOwnProfile =
        isAuthenticated &&
        Boolean(currentUser) &&
        Boolean(profile) &&
        (profile?.username === currentUser?.username || profile?.id === currentUser?.username || profile?.id === currentUser?.id);
    const messagePath = `/messages?seller=${profile?.id || ''}`;

    const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        setFormError('');

        try {
            const response = await updateMyProfile({
                name: editForm.name.trim(),
                username: editForm.username.trim().toLowerCase(),
                location: editForm.location.trim(),
                bio: editForm.bio.trim(),
            });

            setProfile(mapBackendProfile(response.data as BackendProfileUser));
            setIsEditing(false);
        } catch (submitError) {
            setFormError(submitError instanceof Error ? submitError.message : 'Could not update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemovePost = async (post: ViewPost) => {
        const shouldRemove = window.confirm(`Remove "${post.title}" from your active posts?`);
        if (!shouldRemove) return;

        setRemovingPostId(post.id);
        setRemoveError('');

        try {
            await removeMyBookPost(post.id);
            setPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id));
        } catch (removePostError) {
            setRemoveError(removePostError instanceof Error ? removePostError.message : 'Could not remove this post.');
        } finally {
            setRemovingPostId('');
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[#FBF8F1] px-4 py-10 text-[#111827] sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl rounded-lg border border-[#D6CCBA] bg-white p-8 shadow-[0_12px_32px_rgba(17,24,39,0.05)]">
                    <div className="h-10 w-40 animate-pulse rounded-full bg-[#F0E7D8]" />
                    <div className="mt-10 h-52 animate-pulse rounded-lg bg-[#F7F2E8]" />
                </div>
            </main>
        );
    }

    if (!profile || error) {
        return (
            <main className="bg-[#FBF8F1] px-4 py-10 text-[#111827] sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl rounded-lg border border-[#D6CCBA] bg-white p-8 shadow-[0_12px_32px_rgba(17,24,39,0.05)]">
                    <Link
                        className="inline-flex items-center gap-2 rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-2 text-sm font-extrabold text-[#111827]"
                        to="/buy-sell"
                    >
                        <ArrowLeft size={17} strokeWidth={2.4} />
                        Back to books
                    </Link>
                    <div className="mt-10 max-w-xl">
                        <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#7D7466]">Profile</p>
                        <h1 className="font-sora mt-3 text-4xl font-extrabold text-[#111827]">Profile not found</h1>
                        <p className="mt-4 text-base leading-7 text-[#626B78]">
                            This reader profile may have moved or is not available right now.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#FBF8F1] px-4 py-8 text-[#111827] sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <Link
                    className="inline-flex items-center gap-2 rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-2 text-sm font-extrabold text-[#111827] shadow-[0_8px_20px_rgba(17,24,39,0.04)] transition hover:border-[#111827]"
                    to="/buy-sell"
                >
                    <ArrowLeft size={17} strokeWidth={2.4} />
                    Back to books
                </Link>

                <section className="mt-8 overflow-hidden rounded-lg border border-[#D6CCBA] bg-white shadow-[0_16px_40px_rgba(17,24,39,0.05)]">
                    <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                        <div className="p-6 sm:p-8 lg:p-10">
                            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#7D7466]">
                                Reader Profile
                            </p>
                            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                                <div
                                    className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white text-2xl font-extrabold text-[#111827] shadow-[0_12px_28px_rgba(17,24,39,0.12)]"
                                    style={{ backgroundColor: profile.avatarColor }}
                                >
                                    {profile.avatarUrl ? (
                                        <img className="h-full w-full object-cover" src={profile.avatarUrl} alt="" />
                                    ) : (
                                        profile.initials
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h1 className="font-sora text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl">
                                        {profile.name}
                                    </h1>
                                    <p className="mt-3 flex items-center gap-2 text-base font-bold text-[#626B78]">
                                        <MapPin size={18} strokeWidth={2.3} />
                                        {profile.area}
                                    </p>
                                    <p className="mt-5 max-w-2xl text-base leading-7 text-[#626B78]">{profile.bio}</p>
                                </div>
                            </div>
                        </div>

                        <aside className="border-t border-[#E8DFD1] bg-[#FFFDF8] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-[#E8DFD1] bg-white p-4">
                                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9B907E]">
                                        Active Posts
                                    </p>
                                    <p className="font-sora mt-2 text-2xl font-extrabold">{posts.length}</p>
                                </div>
                                <div className="rounded-lg border border-[#E8DFD1] bg-white p-4">
                                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9B907E]">Sell</p>
                                    <p className="font-sora mt-2 text-2xl font-extrabold">{sellCount}</p>
                                </div>
                                <div className="rounded-lg border border-[#E8DFD1] bg-white p-4">
                                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9B907E]">
                                        Exchange
                                    </p>
                                    <p className="font-sora mt-2 text-2xl font-extrabold">{exchangeCount}</p>
                                </div>
                                <div className="rounded-lg border border-[#E8DFD1] bg-white p-4">
                                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9B907E]">
                                        Joined
                                    </p>
                                    <p className="mt-2 text-sm font-extrabold">{profile.joinedLabel}</p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3">
                                {isOwnProfile ? (
                                    <>
                                        <button
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                                            onClick={() => setIsEditing(true)}
                                            type="button"
                                        >
                                            <Edit3 size={17} strokeWidth={2.4} />
                                            Edit Profile
                                        </button>
                                        <Link
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-white px-5 py-3 text-sm font-extrabold text-[#111827] transition hover:border-[#111827]"
                                            to="/post"
                                        >
                                            <Plus size={17} strokeWidth={2.4} />
                                            Post a Book
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                                        to={isAuthenticated ? messagePath : createLoginRedirect(messagePath)}
                                    >
                                        <Mail size={17} strokeWidth={2.4} />
                                        Message
                                    </Link>
                                )}
                            </div>
                        </aside>
                    </div>
                </section>

                {isEditing ? (
                    <section className="mt-6 rounded-lg border border-[#D6CCBA] bg-white p-6 shadow-[0_12px_32px_rgba(17,24,39,0.05)]">
                        <form className="grid gap-5" onSubmit={handleEditSubmit}>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#7D7466]">
                                        Edit Profile
                                    </p>
                                    <h2 className="font-sora mt-2 text-2xl font-extrabold">Update your reader info</h2>
                                </div>
                                <button
                                    className="grid h-10 w-10 place-items-center rounded-full border border-[#D6CCBA] bg-[#FFFDF8]"
                                    onClick={() => setIsEditing(false)}
                                    type="button"
                                    aria-label="Close edit profile"
                                >
                                    <X size={18} strokeWidth={2.4} />
                                </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="grid gap-2 text-sm font-extrabold text-[#111827]">
                                    Name
                                    <input
                                        className="rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-3 outline-none focus:border-[#111827]"
                                        value={editForm.name}
                                        onChange={(event) => setEditForm((form) => ({ ...form, name: event.target.value }))}
                                        required
                                    />
                                </label>
                                <label className="grid gap-2 text-sm font-extrabold text-[#111827]">
                                    Username
                                    <input
                                        className="rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-3 outline-none focus:border-[#111827]"
                                        value={editForm.username}
                                        onChange={(event) =>
                                            setEditForm((form) => ({ ...form, username: event.target.value }))
                                        }
                                        required
                                    />
                                </label>
                                <label className="grid gap-2 text-sm font-extrabold text-[#111827] md:col-span-2">
                                    Location
                                    <input
                                        className="rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-3 outline-none focus:border-[#111827]"
                                        value={editForm.location}
                                        onChange={(event) =>
                                            setEditForm((form) => ({ ...form, location: event.target.value }))
                                        }
                                        placeholder="Mirpur, Dhaka"
                                    />
                                </label>
                                <label className="grid gap-2 text-sm font-extrabold text-[#111827] md:col-span-2">
                                    Bio
                                    <textarea
                                        className="min-h-28 rounded-lg border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-3 outline-none focus:border-[#111827]"
                                        value={editForm.bio}
                                        onChange={(event) => setEditForm((form) => ({ ...form, bio: event.target.value }))}
                                    />
                                </label>
                            </div>

                            {formError ? (
                                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                    {formError}
                                </p>
                            ) : null}

                            <button
                                className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={isSaving}
                                type="submit"
                            >
                                <Save size={17} strokeWidth={2.4} />
                                {isSaving ? 'Saving...' : 'Save changes'}
                            </button>
                        </form>
                    </section>
                ) : null}

                <section className="mt-10">
                    <div className="flex flex-col gap-4 border-b border-[#D6CCBA] pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#7D7466]">
                                Active Posts
                            </p>
                            <h2 className="font-sora mt-2 text-3xl font-extrabold text-[#111827]">
                                Books from {profile.name.split(' ')[0]}
                            </h2>
                        </div>

                        <div className="flex rounded-full border border-[#D6CCBA] bg-[#FFFDF8] p-1">
                            {tabs.map((tab) => (
                                <button
                                    className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                                        activeTab === tab.id
                                            ? 'bg-[#111827] text-white shadow-[0_8px_18px_rgba(17,24,39,0.12)]'
                                            : 'text-[#626B78] hover:text-[#111827]'
                                    }`}
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    type="button"
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {removeError ? (
                        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                            {removeError}
                        </p>
                    ) : null}

                    {filteredPosts.length > 0 ? (
                        <div className="mt-6 grid w-full min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post) => (
                                <div className="grid min-w-0 gap-3" key={post.id}>  
                                    <CompactBookCard
                                        book={mapProfilePostToCompactBook(post)}
                                        size="compact"
                                        to={`/books/${post.id}`}
                                    />
                                    {isOwnProfile ? (
                                        <button
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-4 py-2 text-sm font-extrabold text-[#991B1B] transition hover:border-[#991B1B] hover:bg-[#FFF1F0] disabled:cursor-not-allowed disabled:opacity-60"
                                            disabled={removingPostId === post.id}
                                            onClick={() => handleRemovePost(post)}
                                            type="button"
                                        >
                                            <Trash2 size={16} strokeWidth={2.4} />
                                            {removingPostId === post.id ? 'Removing...' : 'Remove post'}
                                        </button>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-lg border border-[#D6CCBA] bg-white p-8 text-center shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EAF4EE] text-[#14532D]">
                                {activeTab === 'exchange' ? (
                                    <Repeat2 size={24} strokeWidth={2.3} />
                                ) : (
                                    <BookOpen size={24} strokeWidth={2.3} />
                                )}
                            </div>
                            <h3 className="font-sora mt-5 text-2xl font-extrabold text-[#111827]">No active posts</h3>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#626B78]">
                                This reader does not have any active book posts right now.
                            </p>
                            <Link
                                className="mt-6 inline-flex items-center justify-center rounded-full border border-[#D6CCBA] bg-[#FFFDF8] px-5 py-3 text-sm font-extrabold text-[#111827] transition hover:border-[#111827]"
                                to={isOwnProfile ? '/post' : '/buy-sell'}
                            >
                                {isOwnProfile ? 'Post a Book' : 'Browse Books'}
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Profile;
