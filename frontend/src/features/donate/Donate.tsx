import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { cardVariants, sectionVariants } from '../../lib/animations';
import DonateFilterBar from './DonationFilterBar';
import DonationCard from './DonationCard';
import { donationPosts } from './data/donationPosts';

const Donate = () => {
    const [category, setCategory] = useState('All Categories');
    const [location, setLocation] = useState('All Locations');

    const hasActiveFilters = category !== 'All Categories' || location !== 'All Locations';

    const filteredPosts = useMemo(() => {
        return donationPosts.filter((post) => {
            if (post.donated) return false;
            const matchesCategory = category === 'All Categories' || post.category === category;
            const matchesLocation = location === 'All Locations' || post.city === location || post.city === 'Other';

            return matchesCategory && matchesLocation;
        });
    }, [category, location]);

    const resetFilters = () => {
        setCategory('All Categories');
        setLocation('All Locations');
    };

    return (
        <main className="min-h-screen bg-[#FAF7EF] text-[#111827]">
            <section className="px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8 lg:pb-14 lg:pt-20">
                <motion.div
                    className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="max-w-3xl text-left" variants={cardVariants}>
                        <p className="mb-5 inline-flex rounded-full border border-[#CFC4B2] bg-[#EEE8DC] px-4 py-2 text-sm font-semibold text-[#111827]">
                            Community Giving
                        </p>
                        <h1 className="font-sora text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl lg:text-6xl">
                            Donate Books
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#4F5865] sm:text-lg">
                            Pass your unused books to someone who can read and benefit from them.
                        </p>
                    </motion.div>
                    <motion.div variants={cardVariants}>
                        <Button href="/post" icon={<ArrowRight size={18} strokeWidth={2.4} />}>
                            Post a Donation
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            <DonateFilterBar
                category={category}
                hasActiveFilters={hasActiveFilters}
                location={location}
                onCategoryChange={setCategory}
                onLocationChange={setLocation}
                onReset={resetFilters}
            />

            <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
                <motion.div
                    className="mx-auto max-w-7xl"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredPosts.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                                {filteredPosts.map((post) => (
                                    <motion.div variants={cardVariants} key={post.id}>
                                        <DonationCard post={post} />
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <div className="rounded-full border border-[#D6CCBA] bg-white px-5 py-3 text-sm font-bold text-[#4F5865] shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
                                    Loading more donations...
                                </div>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            className="mx-auto max-w-xl rounded-lg border border-[#D6CCBA] bg-white p-8 text-center shadow-[0_16px_38px_rgba(17,24,39,0.10)]"
                            variants={cardVariants}
                        >
                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[#F4EFE6] text-[#111827]">
                                <RefreshCcw size={24} strokeWidth={2.3} />
                            </div>
                            <h2 className="font-sora mt-5 text-2xl font-extrabold text-[#111827]">
                                No donations found
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-[#4F5865]">
                                Try changing your filters or check again later.
                            </p>
                            <button
                                className="mt-6 rounded-full bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243041] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
                                onClick={resetFilters}
                                type="button"
                            >
                                Reset Filters
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </section>
        </main>
    );
};

export default Donate;
