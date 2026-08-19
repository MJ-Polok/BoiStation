import { motion } from 'framer-motion';
import { ArrowRight, Check, Plus } from 'lucide-react';
import HeroBookshelfIllustration from './HeroBookshelfIllustration';
import { cardVariants, sectionVariants } from '../../lib/animations';
import Button from '../../components/ui/Button';

const trustHints = ['Affordable books', 'Exchange & donate', 'Local readers'];

const smoothEase = [0.22, 1, 0.36, 1] as const;

const HeroSection = () => {
    return (
        <section id="top" className="bg-[#8BE8B1] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <motion.div
                className="mx-auto rounded-[28px] border border-[#E7DFD0] bg-[#FFFDF8] px-5 py-10 shadow-[0_18px_50px_rgba(17,24,39,0.10)] sm:px-8 sm:py-14 lg:min-h-[calc(100vh-48px)] lg:px-16 lg:py-20"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: smoothEase }}
            >
                <div className="grid h-full items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
                    <motion.div
                        className="text-left"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.p
                            className="mb-5 inline-flex rounded-full border border-[#D8D2C4] bg-[#F4EFE6] px-4 py-2 text-sm font-semibold text-[#111827]"
                            variants={cardVariants}
                        >
                            Books for everyone in Bangladesh
                        </motion.p>

                        <motion.h1
                            className="font-sora max-w-[720px] text-4xl font-extrabold leading-[1.08] text-[#111827] sm:text-5xl lg:text-6xl xl:text-[68px]"
                            variants={cardVariants}
                        >
                            Buy, sell, exchange, or donate books in one place
                        </motion.h1>

                        <motion.p
                            className="mt-6 max-w-xl text-base leading-7 text-[#5F6673] sm:text-lg"
                            variants={cardVariants}
                        >
                            Find affordable books, pass on unused ones, and help books reach new readers across Bangladesh.
                        </motion.p>

                        <motion.div
                            className="mt-8 flex flex-col gap-3 min-[420px]:flex-row"
                            variants={cardVariants}
                        >
                            <Button href="/buy-sell" icon={<ArrowRight size={18} strokeWidth={2.4} />}>
                                Find Books
                            </Button>
                            <Button
                                href="/post"
                                icon={<Plus size={18} strokeWidth={2.4} />}
                                variant="secondary"
                            >
                                Post a Book
                            </Button>
                        </motion.div>

                        <motion.ul
                            className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-[#5F6673]"
                            variants={cardVariants}
                            aria-label="Boi Station benefits"
                        >
                            {trustHints.map((hint) => (
                                <li className="flex items-center gap-2" key={hint}>
                                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#EAF4EE] text-[#111827]">
                                        <Check size={13} strokeWidth={3} />
                                    </span>
                                    {hint}
                                </li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    <div className="pt-2 lg:pt-0">
                        <HeroBookshelfIllustration />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
