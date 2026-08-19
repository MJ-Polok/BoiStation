import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';

const footerLinks = [
    { label: 'Home', to: '/' },
    { label: 'Buy & Sell', to: '/buy-sell' },
    { label: 'Exchange', to: '/exchange' },
    { label: 'Donate', to: '/donate' },
    { label: 'Post a Book', to: '/post' },
];

const Footer = () => {
    return (
        <footer className="bg-[#111827] px-4 py-10 text-white sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="max-w-md">
                    <div className="inline-flex rounded-xl bg-white px-3 py-2">
                        <BrandLogo className="h-10 w-[172px]" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[#CBD5E1]">
                        A trusted book-centered platform for students and readers in Bangladesh.
                    </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {footerLinks.map((link) => (
                        <Link
                            className="text-sm font-bold text-[#CBD5E1] transition hover:text-white"
                            to={link.to}
                            key={link.to}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/15 pt-6 text-sm font-semibold text-[#CBD5E1] sm:flex-row sm:items-center sm:justify-between">
                <p>© 2026 Boi Station</p>
                <p>Made for readers in Bangladesh</p>
            </div>
        </footer>
    );
};

export default Footer;
