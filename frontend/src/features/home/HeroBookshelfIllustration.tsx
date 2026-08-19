import { motion } from 'framer-motion'
const smoothEase = [0.22, 1, 0.36, 1] as const

const HeroBookshelfIllustration = () => {
    return (
        <motion.div
            className="relative mx-auto w-auto"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: smoothEase }}
            aria-hidden="true"
        >
            <svg
                className="h-auto w-full"
                viewBox="0 0 560 430"
                role="img"
                aria-label="Bookshelf marketplace illustration"
            >
                <rect x="26" y="34" width="508" height="352" rx="18" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <path d="M52 152H508" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
                <path d="M52 270H508" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
                <path d="M148 56V374" stroke="#111827" strokeWidth="3" />
                <path d="M404 56V374" stroke="#111827" strokeWidth="3" />

                <rect x="68" y="72" width="36" height="74" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="104" y="72" width="32" height="74" fill="#7DE3A5" stroke="#111827" strokeWidth="3" />
                <rect x="72" y="122" width="28" height="18" fill="#F4D35E" />
                <rect x="168" y="76" width="42" height="70" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="210" y="84" width="34" height="62" fill="#F4D35E" stroke="#111827" strokeWidth="3" />
                <rect x="260" y="78" width="34" height="70" transform="rotate(-22 260 78)" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="279" y="127" width="35" height="18" transform="rotate(-22 279 127)" fill="#A78BFA" />
                <rect x="338" y="106" width="54" height="38" rx="4" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="392" y="106" width="24" height="38" fill="#7DE3A5" stroke="#111827" strokeWidth="3" />
                <text x="183" y="122" fill="#111827" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" transform="rotate(-90 183 122)">
                    Sell
                </text>

                <rect x="72" y="188" width="76" height="48" rx="5" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="110" y="236" width="38" height="28" fill="#F4D35E" stroke="#111827" strokeWidth="3" />
                <rect x="148" y="188" width="26" height="76" fill="#7DE3A5" stroke="#111827" strokeWidth="3" />
                <rect x="200" y="184" width="132" height="72" rx="10" fill="#EAF4EE" stroke="#111827" strokeWidth="3" />
                <path d="M232 222H292" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
                <text x="218" y="210" fill="#111827" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="800">
                    ৳
                </text>
                <rect x="354" y="190" width="34" height="68" transform="rotate(15 354 190)" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="352" y="240" width="36" height="18" transform="rotate(15 352 240)" fill="#F9735B" />
                <text x="432" y="238" fill="#111827" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" transform="rotate(-90 432 238)">
                    Swap
                </text>
                <path d="M450 191c16 0 29 13 29 29s-13 29-29 29-29-13-29-29 13-29 29-29Z" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <path d="M437 220h27m0 0-9-9m9 9-9 9" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                <rect x="74" y="296" width="34" height="70" transform="rotate(-14 74 296)" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="108" y="292" width="34" height="76" transform="rotate(-14 108 292)" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="90" y="342" width="34" height="18" transform="rotate(-14 90 342)" fill="#93C5FD" />
                <rect x="186" y="316" width="74" height="48" rx="5" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="260" y="316" width="24" height="48" fill="#A78BFA" stroke="#111827" strokeWidth="3" />
                <rect x="320" y="290" width="40" height="76" transform="rotate(28 320 290)" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="319" y="342" width="42" height="19" transform="rotate(28 319 342)" fill="#F4D35E" />
                <rect x="420" y="296" width="40" height="70" fill="#FFFDF8" stroke="#111827" strokeWidth="3" />
                <rect x="460" y="296" width="34" height="70" fill="#7DE3A5" stroke="#111827" strokeWidth="3" />
                <text x="438" y="350" fill="#111827" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" transform="rotate(-90 438 350)">
                    Donate
                </text>
            </svg>

            <div className="absolute -bottom-3 left-8 hidden rounded-lg border border-[#111827] bg-[#FFFDF8] px-4 py-3 shadow-[6px_6px_0_#111827] sm:block">
                <p className="font-sora text-sm font-bold text-[#111827]">3 ways to pass books on</p>
                <p className="mt-1 text-xs font-medium text-[#5F6673]">Sell, swap, or donate</p>
            </div>
        </motion.div>
    );
};

export default HeroBookshelfIllustration;