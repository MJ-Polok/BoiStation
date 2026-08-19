import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { cardVariants, sectionVariants } from '../../lib/animations';

const Donate = () => {
    return (
        <main className="min-h-screen bg-[#FAF7EF] px-4 py-16 text-[#111827] sm:px-6 sm:py-20 lg:px-8">
            <motion.section
                className="mx-auto flex min-h-[calc(100vh-18rem)] max-w-5xl items-center justify-center"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="w-full text-center" variants={cardVariants}>
                    <p className="mb-7 inline-flex rounded-full border border-[#CFC4B2] bg-[#EEE8DC] px-5 py-2 text-sm font-bold text-[#111827]">
                        Coming Soon
                    </p>

                    <h1 className="font-sora mx-auto max-w-4xl text-5xl font-extrabold leading-tight text-[#111827] sm:text-6xl lg:text-7xl">
                        Donate Books
                    </h1>

                    <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#4F5865] sm:text-xl sm:leading-9">
                        We are preparing the donation flow for Boi Station. Soon, readers will be able to pass unused books to people who need them.
                    </p>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#697383] sm:text-lg">
                        Until then, you can explore available books or post books for sale and exchange.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button href="/" variant="secondary" icon={<ArrowLeft size={18} strokeWidth={2.4} />}>
                            Back to Home
                        </Button>
                        <Button href="/buy-sell" icon={<ArrowRight size={18} strokeWidth={2.4} />}>
                            Explore Books
                        </Button>
                    </div>
                </motion.div>
            </motion.section>
        </main>
    );
};

export default Donate;
