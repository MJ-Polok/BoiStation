import { useState } from 'react';
import { Bell, Bookmark, Menu, Search, UserRound, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useMockAuth } from '../../hooks/useMockAuth';
import BrandLogo from '../ui/BrandLogo';
 
const sectionLinks = [
    { label: 'Home', href: '#top' },
    { label: 'Why Boi Station', href: '#why' },
    { label: 'Features', href: '#features' },
    { label: 'Recent Books', href: '#recent-books' },
];
 
const PublicNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { currentUser, isAuthenticated, logout } = useMockAuth();
 
    return (
        <header className="sticky top-0 z-50 bg-[#8BE8B1] px-4 py-3 sm:px-6 lg:px-8">
            {/* Outer wrapper controls max-width; nav itself keeps a fixed rounded-full shape always */}
            <div className="mx-auto max-w-7xl">
                <nav className="rounded-full border border-[#D6CCBA] bg-[#FFFDF8]/95 px-3 py-2 shadow-[0_10px_30px_rgba(17,24,39,0.08)] backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                        <a className="ml-[10px] flex shrink-0 items-center gap-3 rounded-full pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]" href="#top">
                            <BrandLogo className="h-[26px] w-[26px] sm:hidden" variant="icon" />
                            <BrandLogo className="hidden h-10 w-[172px] sm:block" />
                        </a>
 
                        <div className="hidden items-center gap-1 lg:flex">
                            {sectionLinks.map((link) => (
                                <a
                                    className="rounded-full px-4 py-2 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]"
                                    href={link.href}
                                    key={link.href}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
 
                        <div className="flex min-w-0 items-center justify-end gap-1.5">
                            <div className={`hidden items-center overflow-hidden rounded-full border border-[#D6CCBA] bg-white transition-all duration-300 md:flex ${isSearchOpen ? 'w-72' : 'w-10'}`}>
                                <button
                                    className="grid h-10 w-10 shrink-0 place-items-center text-[#111827]"
                                    onClick={() => setIsSearchOpen((value) => !value)}
                                    type="button"
                                    aria-label="Toggle search"
                                >
                                    <Search size={18} strokeWidth={2.3} />
                                </button>
                                <input
                                    className="min-w-0 flex-1 bg-transparent pr-4 text-sm font-semibold text-[#111827] outline-none placeholder:text-[#8A8175]"
                                    placeholder="Search books..."
                                    type="search"
                                />
                            </div>
                            <button className="grid h-10 w-10 place-items-center rounded-full text-[#111827] transition hover:bg-[#EEE8DC] md:hidden" type="button" aria-label="Search">
                                <Search size={19} strokeWidth={2.3} />
                            </button>
                            {isAuthenticated && currentUser ? (
                                <>
                                    <Link
                                        className="hidden h-10 w-10 place-items-center rounded-full text-[#111827] transition hover:bg-[#EEE8DC] sm:grid"
                                        to="/saved"
                                        aria-label="Saved books"
                                    >
                                        <Bookmark size={19} strokeWidth={2.3} />
                                    </Link>
                                    <Link
                                        className="relative grid h-10 w-10 place-items-center rounded-full text-[#111827] transition hover:bg-[#EEE8DC]"
                                        to="/messages"
                                        aria-label="Notifications"
                                    >
                                        <Bell size={19} strokeWidth={2.3} />
                                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F9735B]" />
                                    </Link>
                                    <Link
                                        className="grid h-10 w-10 place-items-center rounded-full text-[#111827] transition hover:bg-[#EEE8DC]"
                                        to={`/profile/${currentUser.username}`}
                                        aria-label="Profile"
                                    >
                                        <UserRound size={19} strokeWidth={2.3} />
                                    </Link>
                                    <Button className="hidden px-5 lg:inline-flex" href="/post">
                                        Post a Book
                                    </Button>
                                    <button
                                        className="hidden rounded-full px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827] xl:inline-flex"
                                        onClick={logout}
                                        type="button"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        className="hidden rounded-full px-5 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#EEE8DC] sm:inline-flex"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                    <Button className="hidden px-5 lg:inline-flex" href="/login">
                                        Sign Up
                                    </Button>
                                </>
                            )}
                            <button
                                className="grid h-10 w-10 place-items-center rounded-full text-[#111827] transition hover:bg-[#EEE8DC] lg:hidden"
                                onClick={() => setIsMenuOpen((value) => !value)}
                                type="button"
                                aria-label="Open menu"
                            >
                                {isMenuOpen ? <X size={21} strokeWidth={2.3} /> : <Menu size={21} strokeWidth={2.3} />}
                            </button>
                        </div>
                    </div>
                </nav>
 
                {/* Mobile dropdown menu now lives OUTSIDE the rounded-full <nav>,
                    as its own card with a fixed rounded-3xl — no radius animates, no oval flash. */}
                {isMenuOpen && (
                    <div className="mt-2 rounded-3xl border border-[#D6CCBA] bg-[#FFFDF8]/95 px-2 py-3 shadow-[0_10px_30px_rgba(17,24,39,0.08)] backdrop-blur lg:hidden">
                        <div className="grid gap-2">
                            {sectionLinks.map((link) => (
                                <a
                                    className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]"
                                    href={link.href}
                                    key={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            {isAuthenticated && currentUser ? (
                                <>
                                    <Link
                                        className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]"
                                        onClick={() => setIsMenuOpen(false)}
                                        to="/saved"
                                    >
                                        Saved Books
                                    </Link>
                                    <Link
                                        className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]"
                                        onClick={() => setIsMenuOpen(false)}
                                        to="/messages"
                                    >
                                        Messages
                                    </Link>
                                    <Link
                                        className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]"
                                        onClick={() => setIsMenuOpen(false)}
                                        to={`/profile/${currentUser.username}`}
                                    >
                                        Profile
                                    </Link>
                                    <Button className="mt-2 w-full" href="/post">
                                        Post a Book
                                    </Button>
                                    <button
                                        className="rounded-xl px-4 py-3 text-left text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]"
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        type="button"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827] sm:hidden"
                                        onClick={() => setIsMenuOpen(false)}
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                    <Button className="mt-2 w-full" href="/login">
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
 
export default PublicNavbar;
