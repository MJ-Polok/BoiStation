import { motion } from 'framer-motion';
import { ArrowRight, BookMarked, Gift, Repeat2, Upload } from 'lucide-react';
import { cardVariants, sectionVariants } from '../../lib/animations';
import Button from '../../components/ui/Button';

const features = [
    {
        title: 'Post a Book',
        description: 'Share a book you want to sell, exchange, or donate in just a few steps.',
        steps: ['Add book details', 'Upload photos and set terms', 'Publish your post'],
        button: 'Post a Book',
        route: '/post',
        icon: Upload,
        accent: '#7DE3A5',
        background: '#FFFDF8',
        visualSide: 'right',
    },
    {
        title: 'Buy & Sell',
        description: 'Browse books from nearby readers and find what you need at a better price.',
        steps: ['Search by title or category', 'Compare price, condition, and location', 'Contact the seller'],
        button: 'Browse Books',
        route: '/buy-sell',
        icon: BookMarked,
        accent: '#F4D35E',
        background: '#F7F4EC',
        visualSide: 'left',
    },
    {
        title: 'Exchange Books',
        description: 'Trade books with other readers instead of buying new ones.',
        steps: ['List the book you have', 'Mention what you want in return', 'Match and exchange'],
        button: 'Explore Exchanges',
        route: '/exchange',
        icon: Repeat2,
        accent: '#93C5FD',
        background: '#FFFDF8',
        visualSide: 'right',
    },
    {
        title: 'Donate Books',
        description: 'Pass your unused books to someone who can read and benefit from them.',
        steps: ['Add donation details', 'Review interested requests', 'Hand over the book'],
        button: 'Donate a Book',
        route: '/donate',
        icon: Gift,
        accent: '#A78BFA',
        background: '#F7F4EC',
        visualSide: 'left',
    },
];

type Feature = (typeof features)[number];

const VisualPlaceholder = ({ feature }: { feature: Feature }) => {
    const Icon = feature.icon;

    return (
        <div className="w-full max-w-[520px] rounded-2xl border border-[#E7DFD0] bg-[#FFFDF8] p-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]">
            <div className="rounded-xl border border-dashed border-[#D8D2C4] bg-[#FAF8F2] p-6">
                <div
                    className="grid h-12 w-12 place-items-center rounded-lg text-[#111827]"
                    style={{ backgroundColor: feature.accent }}
                >
                    <Icon size={24} strokeWidth={2.3} />
                </div>
                <div className="mt-8 space-y-3">
                    <div className="h-3 w-3/4 rounded-full bg-[#111827]/15" />
                    <div className="h-3 w-1/2 rounded-full bg-[#111827]/10" />
                    <div className="h-3 w-2/3 rounded-full bg-[#111827]/10" />
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="h-20 rounded-lg border border-[#E7DFD0] bg-[#FFFDF8]" />
                    <div className="h-20 rounded-lg border border-[#E7DFD0] bg-[#FFFDF8]" />
                    <div className="h-20 rounded-lg border border-[#E7DFD0] bg-[#FFFDF8]" />
                </div>
            </div>
        </div>
    );
};

const FeatureContent = ({ feature }: { feature: Feature }) => {
    return (
        <div className="max-w-[480px] text-left">
            <div
                className="mb-5 grid h-12 w-12 place-items-center rounded-lg text-[#111827]"
                style={{ backgroundColor: feature.accent }}
            >
                <feature.icon size={24} strokeWidth={2.3} />
            </div>
            <h3 className="font-sora text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl">
                {feature.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[#5F6673] sm:text-lg">
                {feature.description}
            </p>

            <ol className="mt-7 space-y-4">
                {feature.steps.map((step, index) => (
                    <li className="flex items-center gap-3 text-sm font-semibold text-[#111827] sm:text-base" key={step}>
                        <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-extrabold"
                            style={{ backgroundColor: feature.accent }}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        {step}
                    </li>
                ))}
            </ol>

            <Button
                className="mt-8"
                href={feature.route}
                icon={<ArrowRight size={18} strokeWidth={2.4} />}
            >
                {feature.button}
            </Button>
        </div>
    );
};

const FeaturePreviewSections = () => {
    return (
        <section id="features" className="bg-[#FFFDF8]">
            <div className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-22">
                <motion.div
                    className="mx-auto max-w-7xl"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                >
                    <motion.div className="max-w-2xl text-left" variants={cardVariants}>
                        <h2 className="font-sora text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl lg:text-5xl">
                            What you can do on Boi Station
                        </h2>
                        <p className="mt-4 text-base leading-7 text-[#5F6673] sm:text-lg">
                            Choose the way you want to pass books forward.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {features.map((feature) => {
                const isVisualFirst = feature.visualSide === 'left';

                return (
                    <section
                        className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-22"
                        style={{ backgroundColor: feature.background }}
                        key={feature.title}
                    >
                        <motion.div
                            className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.25 }}
                        >
                            <motion.div
                                className={isVisualFirst ? 'order-2 flex justify-start lg:order-1' : 'order-2 flex justify-start lg:justify-end'}
                                variants={cardVariants}
                            >
                                <VisualPlaceholder feature={feature} />
                            </motion.div>
                            <motion.div
                                className={isVisualFirst ? 'order-1 lg:order-2 lg:flex lg:justify-end' : 'order-1'}
                                variants={cardVariants}
                            >
                                <FeatureContent feature={feature} />
                            </motion.div>
                        </motion.div>
                    </section>
                );
            })}
        </section>
    );
};

export default FeaturePreviewSections;
