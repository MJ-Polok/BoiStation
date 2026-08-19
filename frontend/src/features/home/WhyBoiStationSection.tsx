import { motion } from 'framer-motion';
import { BookOpen, ClipboardPenLine, Recycle, UsersRound } from 'lucide-react';
import { cardVariants, sectionVariants } from '../../lib/animations';


const benefits = [
    {
        title: 'Affordable Books',
        description: 'Find new and used books at lower prices.',
        icon: BookOpen,
        accent: '#F4D35E',
    },
    {
        title: 'Less Book Waste',
        description: 'Give unused books a second life through selling, donating, or exchanging.',
        icon: Recycle,
        accent: '#7DE3A5',
    },
    {
        title: 'Easy to Post',
        description: 'Create a book post with clear details in just a few steps.',
        icon: ClipboardPenLine,
        accent: '#93C5FD',
    },
    {
        title: 'For Every Reader',
        description: 'Browse academic, fiction, children’s, religious, career, and more.',
        icon: UsersRound,
        accent: '#A78BFA',
    },
];

const WhyBoiStationSection = () => {
    return (
        <section id="why" className="bg-[#DFF8E9] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-22">
            <motion.div
                className="mx-auto max-w-7xl"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
            >
                <div className="max-w-2xl">
                    <motion.h2
                        className="font-sora text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl lg:text-5xl"
                        variants={cardVariants}
                    >
                        Why Boi Station
                    </motion.h2>
                    <motion.p
                        className="mt-4 text-base leading-7 text-[#5F6673] sm:text-lg"
                        variants={cardVariants}
                    >
                        A simple way to keep books moving between readers.
                    </motion.p>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;

                        return (
                            <article
                                className="rounded-lg border border-[#CFE8D8] bg-[#FFFDF8] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-[#B7DDC4] hover:shadow-[0_14px_34px_rgba(17,24,39,0.08)]"
                                key={benefit.title}
                            >
                                <div
                                    className="grid h-12 w-12 place-items-center rounded-lg text-[#111827]"
                                    style={{ backgroundColor: benefit.accent }}
                                >
                                    <Icon size={24} strokeWidth={2.3} />
                                </div>
                                <h3 className="font-sora mt-5 text-xl font-bold leading-snug text-[#111827]">
                                    {benefit.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-[#5F6673]">
                                    {benefit.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
};

export default WhyBoiStationSection;
