import { apiRequest } from '../../lib/auth';
import type { BackendBookPost } from '../book-details/api';
import type { SellPost } from './data/sellPosts';

type BooksResponse = {
    success: boolean;
    data: BackendBookPost[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
};

const avatarColors = ['#7DE3A5', '#93C5FD', '#A78BFA', '#F4D35E', '#F9735B'];
const fallbackPhotoColors = ['#EAF4EE', '#F4D35E', '#93C5FD', '#A78BFA'];

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'BS';

const getPriceParams = (priceRange: string) => {
    if (priceRange === 'Any Price') return {};
    if (priceRange.startsWith('Under')) return { maxPrice: '199' };
    if (priceRange.startsWith('Above')) return { minPrice: '1001' };
    if (priceRange.includes('1000')) return { minPrice: '500', maxPrice: '1000' };
    if (priceRange.includes('500')) return { minPrice: '200', maxPrice: '500' };
    return {};
};

const buildBooksQuery = ({
    category,
    priceRange,
    search,
}: {
    category: string;
    priceRange: string;
    search: string;
}) => {
    const params = new URLSearchParams({
        type: 'sell',
        page: '1',
        limit: '50',
    });

    if (category !== 'All Categories') {
        params.set('category', category);
    }

    if (search.trim()) {
        params.set('search', search.trim());
    }

    Object.entries(getPriceParams(priceRange)).forEach(([key, value]) => {
        params.set(key, value);
    });

    return params.toString();
};

export const fetchSellBooks = (filters: { category: string; priceRange: string; search: string }) =>
    apiRequest<BooksResponse>(`/books?${buildBooksQuery(filters)}`);

export const mapBackendBookToSellPost = (post: BackendBookPost, index: number): SellPost => {
    const sellerName = post.owner?.name || 'Boi Station Reader';
    const coverUrl = post.officialBook?.coverUrl || post.frontImage?.url;
    const photoUrls = post.sellerImages?.map((image) => image.url).filter(Boolean) || [];

    return {
        id: post._id,
        title: post.title,
        author: post.author,
        category: post.category,
        price: post.price || 0,
        priceLabel: `৳${post.price || 0}`,
        condition: post.condition as SellPost['condition'],
        location: post.location,
        sellerName,
        sellerUsername: post.owner?.username || post.owner?.id || post.owner?._id,
        sellerInitials: getInitials(sellerName),
        sellerColor: avatarColors[index % avatarColors.length],
        negotiable: Boolean(post.isNegotiable),
        sold: post.status === 'sold',
        databaseMatched: Boolean(coverUrl),
        coverUrl,
        coverColor: '#F7F2E8',
        photoColors: fallbackPhotoColors,
        photoUrls,
    };
};
