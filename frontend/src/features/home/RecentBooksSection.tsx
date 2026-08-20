import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import CompactBookCard, { type CompactBook } from '../../components/ui/CompactBookCard';
import { cardVariants, sectionVariants } from '../../lib/animations';
import { apiRequest } from '../../lib/auth';
import type { BackendBookPost } from '../book-details/api';

type RecentBooksResponse = {
    success: boolean;
    data: BackendBookPost[];
};

const validConditions: CompactBook['condition'][] = ['New', 'Used', 'Good', 'Fair'];

const getCondition = (condition: string): CompactBook['condition'] =>
    validConditions.includes(condition as CompactBook['condition'])
        ? (condition as CompactBook['condition'])
        : 'Used';

const getPostType = (type: BackendBookPost['type']): CompactBook['type'] => {
    if (type === 'exchange') return 'Exchange';
    if (type === 'donate') return 'Donation';
    return 'For Sale';
};

const mapRecentBook = (post: BackendBookPost): CompactBook => {
    const posterUrl = post.officialBook?.coverUrl || post.frontImage?.url;

    return {
        id: post._id,
        title: post.title,
        author: post.author,
        type: getPostType(post.type),
        condition: getCondition(post.condition),
        priceLabel: post.type === 'sell' ? `৳${post.price || 0}` : post.type === 'exchange' ? 'Exchange' : 'Free',
        location: post.location,
        coverColor: '#F7F2E8',
        accentColor: post.type === 'exchange' ? '#93C5FD' : '#7DE3A5',
        coverLabel: post.title,
        coverMeta: post.category,
        posterUrl,
        hasDatabaseMatch: Boolean(post.officialBook?.coverUrl),
    };
};

const RecentBooksSection = () => {
    const [books, setBooks] = useState<CompactBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        apiRequest<RecentBooksResponse>('/books?page=1&limit=4')
            .then((response) => {
                if (!isMounted) return;
                setBooks(response.data.map(mapRecentBook));
            })
            .catch((loadError) => {
                if (!isMounted) return;
                setError(loadError instanceof Error ? loadError.message : 'Could not load recent books.');
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section id="recent-books" className="bg-[#FFFDF8] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-22">
            <motion.div
                className="mx-auto max-w-7xl"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <motion.div className="max-w-2xl text-left" variants={cardVariants}>
                        <h2 className="font-sora text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl lg:text-5xl">
                            Recent Books
                        </h2>
                        <p className="mt-4 text-base leading-7 text-[#5F6673] sm:text-lg">
                            Freshly posted books from the community.
                        </p>
                    </motion.div>

                    <motion.div variants={cardVariants}>
                        <Button
                            className="w-full sm:w-auto"
                            href="/buy-sell"
                            icon={<ArrowRight size={18} strokeWidth={2.4} />}
                        >
                            View All Books
                        </Button>
                    </motion.div>
                </div>

                {isLoading ? (
                    <div className="mt-10 grid w-full min-w-0 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                className="h-[430px] animate-pulse rounded-lg border border-[#E7DFD0] bg-[#F7F4EC]"
                                key={`recent-book-loading-${index}`}
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="mt-10 rounded-lg border border-[#E7DFD0] bg-[#FAF7EF] px-5 py-6 text-left">
                        <p className="font-bold text-[#111827]">Recent books could not be loaded.</p>
                        <p className="mt-2 text-sm font-semibold text-[#626B78]">{error}</p>
                    </div>
                ) : books.length ? (
                    <div className="mt-10 grid w-full min-w-0 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
                        {books.map((book) => (
                            <motion.div className="min-w-0" variants={cardVariants} key={book.id}>
                                <CompactBookCard book={book} to={`/books/${book.id}`} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-lg border border-[#E7DFD0] bg-[#FAF7EF] px-5 py-6 text-left">
                        <p className="font-bold text-[#111827]">No recent books yet.</p>
                        <p className="mt-2 text-sm font-semibold text-[#626B78]">
                            New active posts will appear here automatically.
                        </p>
                    </div>
                )}
            </motion.div>
        </section>
    );
};

export default RecentBooksSection;
