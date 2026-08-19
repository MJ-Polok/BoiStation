import { exchangeCategories } from './data/exchangePosts';

type ExchangeFilterBarProps = {
    category: string;
    hasActiveFilters: boolean;
    onCategoryChange: (value: string) => void;
    onReset: () => void;
};

const ExchangeFilterBar = ({
    category,
    hasActiveFilters,
    onCategoryChange,
    onReset,
}: ExchangeFilterBarProps) => {
    return (
        <div className="sticky top-0 z-30 border-y border-[#D6CCBA] bg-[#FAF7EF]/92 px-4 py-4 shadow-[0_10px_30px_rgba(17,24,39,0.07)] backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-[260px_auto]">
                <label>
                    <span className="sr-only">Category</span>
                    <select
                        className="h-12 w-full rounded-full border border-[#CFC4B2] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition hover:border-[#111827] focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
                        onChange={(event) => onCategoryChange(event.target.value)}
                        value={category}
                    >
                        {exchangeCategories.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </label>

                {hasActiveFilters && (
                    <button
                        className="h-12 justify-self-start rounded-full border border-[#CFC4B2] bg-transparent px-5 text-sm font-bold text-[#111827] transition hover:bg-[#EEE8DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
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

export default ExchangeFilterBar;
