import { useState } from 'react';
import { Bell, Bookmark, ClipboardList, Menu, Search, ShieldCheck, UserRound, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import { useMockAuth } from '../../hooks/useMockAuth';
import BrandLogo from '../ui/BrandLogo';
import LanguageToggle from '../ui/LanguageToggle';

const navLinks = [
    { labelKey: 'nav.buySell', to: '/buy-sell' },
    { labelKey: 'nav.exchange', to: '/exchange' },
    { labelKey: 'nav.donate', to: '/donate' },
];

const iconButtonClass =
    'grid h-10 w-10 place-items-center rounded-full text-[#111827] transition hover:bg-[#EEE8DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser, isAuthenticated, logout } = useMockAuth();
    const { i18n, t } = useTranslation();
    const languageClass = i18n.language === 'bn' ? 'font-bn-body' : '';

    return (
        <header className={`sticky top-0 z-50 bg-[#FAF7EF] px-4 py-3 sm:px-6 lg:px-8 ${languageClass}`}>
            <div className="mx-auto max-w-7xl">
                <nav className="rounded-full border border-[#D6CCBA] bg-[#FFFDF8]/95 px-3 py-2 shadow-[0_10px_30px_rgba(17,24,39,0.08)] backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                        <Link className="ml-[10px] flex shrink-0 items-center gap-3 rounded-full pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]" to="/">
                            <BrandLogo className="h-[26px] w-[26px] sm:hidden" variant="icon" />
                            <BrandLogo className="hidden h-10 w-[172px] sm:block" />
                        </Link>

                        <div className="hidden items-center gap-1 lg:flex">
                            {navLinks.map((link) => (
                                <NavLink
                                    className={({ isActive }) =>
                                        `relative rounded-full px-4 py-2 text-sm font-bold transition ${isActive
                                            ? 'bg-[#111827] pl-5 text-white'
                                            : 'text-[#4F5865] hover:bg-[#EEE8DC] hover:text-[#111827]'
                                        }`
                                    }
                                    to={link.to}
                                    key={link.to}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <span className="absolute left-2 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-[#7DE3A5]" />
                                            )}
                                            {t(link.labelKey)}
                                        </>
                                    )}
                                </NavLink>
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
                                    placeholder={t('common.searchBooks')}
                                    type="search"
                                />
                            </div>

                            <button className={`${iconButtonClass} md:hidden`} type="button" aria-label="Search">
                                <Search size={19} strokeWidth={2.3} />
                            </button>
                            <LanguageToggle className="hidden lg:inline-grid" />

                            {isAuthenticated && currentUser ? (
                                <>
                                    <Link className={`${iconButtonClass} hidden sm:grid`} to="/saved" aria-label={t('common.savedBooks')}>
                                        <Bookmark size={19} strokeWidth={2.3} />
                                    </Link>
                                    <Link className={`${iconButtonClass} hidden sm:grid`} to="/orders" aria-label={t('common.orders')}>
                                        <ClipboardList size={19} strokeWidth={2.3} />
                                    </Link>
                                    <Link className={`${iconButtonClass} relative`} to="/messages" aria-label={t('common.messages')}>
                                        <Bell size={19} strokeWidth={2.3} />
                                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F9735B]" />
                                    </Link>
                                    {currentUser.role === 'admin' && (
                                        <Link className={`${iconButtonClass} hidden sm:grid`} to="/admin/orders" aria-label={t('common.adminOrders')}>
                                            <ShieldCheck size={19} strokeWidth={2.3} />
                                        </Link>
                                    )}
                                    <Link className={iconButtonClass} to={`/profile/${currentUser.username}`} aria-label={t('common.profile')}>
                                        <UserRound size={19} strokeWidth={2.3} />
                                    </Link>
                                    <Button className="hidden px-5 lg:inline-flex" href="/post">
                                        {t('common.postBook')}
                                    </Button>
                                    <button
                                        className="hidden rounded-full px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827] xl:inline-flex"
                                        onClick={logout}
                                        type="button"
                                    >
                                        {t('common.logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        className="hidden rounded-full px-5 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#EEE8DC] sm:inline-flex"
                                        to="/login"
                                    >
                                        {t('common.login')}
                                    </Link>
                                    <Button className="hidden px-5 lg:inline-flex" href="/login">
                                        {t('common.signUp')}
                                    </Button>
                                </>
                            )}
                            <button
                                className={`${iconButtonClass} lg:hidden`}
                                onClick={() => setIsMenuOpen((value) => !value)}
                                type="button"
                                aria-label="Open menu"
                            >
                                {isMenuOpen ? <X size={21} strokeWidth={2.3} /> : <Menu size={21} strokeWidth={2.3} />}
                            </button>
                        </div>
                    </div>
                </nav>

                {isMenuOpen && (
                    <div className="mt-2 rounded-3xl border border-[#D6CCBA] bg-[#FFFDF8]/95 px-2 py-3 shadow-[0_10px_30px_rgba(17,24,39,0.08)] backdrop-blur lg:hidden">
                        <div className="grid gap-2">
                            <div className="px-2 pb-2 md:hidden">
                                <LanguageToggle className="grid w-full" />
                            </div>
                            {navLinks.map((link) => (
                                <NavLink
                                    className={({ isActive }) =>
                                        `rounded-xl px-4 py-3 text-sm font-bold transition ${isActive
                                            ? 'bg-[#111827] text-white'
                                            : 'text-[#4F5865] hover:bg-[#EEE8DC] hover:text-[#111827]'
                                        }`
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                    to={link.to}
                                    key={link.to}
                                >
                                    {t(link.labelKey)}
                                </NavLink>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <NavLink className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]" onClick={() => setIsMenuOpen(false)} to="/saved">
                                        {t('common.savedBooks')}
                                    </NavLink>
                                    <NavLink className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]" onClick={() => setIsMenuOpen(false)} to="/messages">
                                        {t('common.messages')}
                                    </NavLink>
                                    <NavLink className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]" onClick={() => setIsMenuOpen(false)} to="/orders">
                                        {t('common.orders')}
                                    </NavLink>
                                    {currentUser?.role === 'admin' && (
                                        <NavLink className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]" onClick={() => setIsMenuOpen(false)} to="/admin/orders">
                                            {t('common.adminOrders')}
                                        </NavLink>
                                    )}
                                    <Button className="mt-2 w-full" href="/post">
                                        {t('common.postBook')}
                                    </Button>
                                    <button
                                        className="rounded-xl px-4 py-3 text-left text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827]"
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        type="button"
                                    >
                                        {t('common.logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink className="rounded-xl px-4 py-3 text-sm font-bold text-[#4F5865] transition hover:bg-[#EEE8DC] hover:text-[#111827] sm:hidden" onClick={() => setIsMenuOpen(false)} to="/login">
                                        {t('common.login')}
                                    </NavLink>
                                    <Button className="mt-2 w-full" href="/login">
                                        {t('common.signUp')}
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

export default Navbar;