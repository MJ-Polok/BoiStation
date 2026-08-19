import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { cardVariants, sectionVariants } from '../../lib/animations';
import ExchangeFilterBar from './ExchangeFilterBar';
import ExchangePostCard from './ExchangePostCard';
import type { ExchangePost } from './data/exchangePosts';
import { fetchExchangeBooks, mapBackendBookToExchangePost } from './api';

const Exchange = () => {
    const [category, setCategory] = useState('All Categories');
    const [remotePosts, setRemotePosts] = useState<ExchangePost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const hasActiveFilters = category !== 'All Categories';

    useEffect(() => {
        let isActive = true;
        setIsLoading(true);
        setLoadError('');

        fetchExchangeBooks({ category })
            .then((response) => {
                if (!isActive) return;
                setRemotePosts(response.data.map(mapBackendBookToExchangePost));
            })
            .catch((error) => {
                if (!isActive) return;
                setRemotePosts([]);
                setLoadError(error instanceof Error ? error.message : 'Could not load exchange posts.');
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [category]);

    const filteredPosts = useMemo(() => remotePosts, [remotePosts]);

    const resetFilters = () => {
        setCategory('All Categories');
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
                            Book Exchange
                        </p>
                        <h1 className="font-sora text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl lg:text-6xl">
                            Exchange Books
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#4F5865] sm:text-lg">
                            Trade books with other readers instead of buying new ones.
                        </p>
                    </motion.div>
                    <motion.div variants={cardVariants}>
                        <Button href="/post" icon={<ArrowRight size={18} strokeWidth={2.4} />}>
                            Post an Exchange
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            <ExchangeFilterBar
                category={category}
                hasActiveFilters={hasActiveFilters}
                onCategoryChange={setCategory}
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
                            <div className="grid gap-6 xl:grid-cols-2">
                                {filteredPosts.map((post) => (
                                    <motion.div variants={cardVariants} key={post.id}>
                                        <ExchangePostCard post={post} />
                                    </motion.div>
                                ))}
                            </div>

                            {isLoading && (
                                <div className="mt-12 flex justify-center">
                                    <div className="rounded-full border border-[#D6CCBA] bg-white px-5 py-3 text-sm font-bold text-[#4F5865] shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
                                        Loading exchanges...
                                    </div>
                                </div>
                            )}
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
                                {loadError ? 'Could not load exchange posts' : 'No exchange posts found'}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-[#4F5865]">
                                {loadError || 'Try changing the category filter to find more exchange posts.'}
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

export default Exchange;

