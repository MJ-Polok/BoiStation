import { Search } from 'lucide-react';
import { categories, priceRanges } from './data/sellPosts';

type BuySellFiltersProps = {
    search: string;
    category: string;
    priceRange: string;
    hasActiveFilters: boolean;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onPriceRangeChange: (value: string) => void;
    onReset: () => void;
};

const BuySellFilters = ({
    search,
    category,
    priceRange,
    hasActiveFilters,
    onSearchChange,
    onCategoryChange,
    onPriceRangeChange,
    onReset,
}: BuySellFiltersProps) => {
    return (
        <div className="sticky top-0 z-30 border-y border-[#D6CCBA] bg-[#FAF7EF]/92 px-4 py-4 shadow-[0_10px_30px_rgba(17,24,39,0.07)] backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
                <label className="relative block">
                    <span className="sr-only">Search books</span>
                    <Search
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#626B78]"
                        size={18}
                        strokeWidth={2.2}
                    />
                    <input
                        className="h-12 w-full rounded-full border border-[#CFC4B2] bg-white pl-11 pr-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#8A8175] hover:border-[#111827] focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search by title or author"
                        type="search"
                        value={search}
                    />
                </label>

                <label>
                    <span className="sr-only">Category</span>
                    <select
                        className="h-12 w-full rounded-full border border-[#CFC4B2] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition hover:border-[#111827] focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
                        onChange={(event) => onCategoryChange(event.target.value)}
                        value={category}
                    >
                        {categories.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span className="sr-only">Price range</span>
                    <select
                        className="h-12 w-full rounded-full border border-[#CFC4B2] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition hover:border-[#111827] focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
                        onChange={(event) => onPriceRangeChange(event.target.value)}
                        value={priceRange}
                    >
                        {priceRanges.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </label>

                {hasActiveFilters && (
                    <button
                        className="h-12 rounded-full border border-[#CFC4B2] bg-transparent px-5 text-sm font-bold text-[#111827] transition hover:bg-[#EEE8DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
                        onClick={onReset}
                        type="button"
                    >
                        Reset Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default BuySellFilters;
