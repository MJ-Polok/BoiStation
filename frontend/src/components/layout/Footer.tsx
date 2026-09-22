import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrandLogo from '../ui/BrandLogo';

const footerLinks = [
    { labelKey: 'nav.home', to: '/' },
    { labelKey: 'nav.buySell', to: '/buy-sell' },
    { labelKey: 'nav.exchange', to: '/exchange' },
    { labelKey: 'nav.donate', to: '/donate' },
    { labelKey: 'common.postBook', to: '/post' },
];

const Footer = () => {
    const { i18n, t } = useTranslation();
    const languageClass = i18n.language === 'bn' ? 'font-bn-body' : '';

    return (
        <footer className={`bg-[#111827] px-4 py-10 text-white sm:px-6 lg:px-8 ${languageClass}`}>
            <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="max-w-md">
                    <div className="inline-flex rounded-xl bg-white px-3 py-2">
                        <BrandLogo className="h-10 w-[172px]" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[#CBD5E1]">
                        {t('footer.description')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {footerLinks.map((link) => (
                        <Link
                            className="text-sm font-bold text-[#CBD5E1] transition hover:text-white"
                            to={link.to}
                            key={link.to}
                        >
                            {t(link.labelKey)}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/15 pt-6 text-sm font-semibold text-[#CBD5E1] sm:flex-row sm:items-center sm:justify-between">
                <p>© 2026 Boi Station</p>
                <p>{t('footer.madeFor')}</p>
            </div>
        </footer>
    );
};

export default Footer;