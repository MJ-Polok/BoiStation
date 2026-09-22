import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '../../i18n';

const options: Array<{ label: string; value: AppLanguage }> = [
    { label: 'বাং', value: 'bn' },
    { label: 'EN', value: 'en' },
];

const LanguageToggle = ({ className = '' }: { className?: string }) => {
    const { i18n } = useTranslation();
    const activeLanguage = i18n.language === 'en' ? 'en' : 'bn';

    const handleLanguageChange = (language: AppLanguage) => {
        if (language !== activeLanguage) {
            void i18n.changeLanguage(language);
        }
    };

    return (
        <div
            className={`h-10 grid-cols-2 rounded-full border border-[#D6CCBA] bg-[#FFFDF8] p-0.5 text-xs font-extrabold shadow-[0_4px_12px_rgba(17,24,39,0.04)] ${className}`}
            aria-label="Select language"
        >
            {options.map((option) => {
                const isActive = option.value === activeLanguage;

                return (
                    <button
                        className={`min-w-12 rounded-full px-3 transition ${
                            isActive ? 'bg-[#111827] text-white shadow-sm' : 'text-[#4F5865] hover:bg-[#EEE8DC]'
                        }`}
                        key={option.value}
                        onClick={() => handleLanguageChange(option.value)}
                        type="button"
                        aria-pressed={isActive}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export default LanguageToggle;