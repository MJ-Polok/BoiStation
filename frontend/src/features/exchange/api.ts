import { apiRequest } from '../../lib/auth';
import type { BackendBookPost } from '../book-details/api';
import type { ExchangePost } from './data/exchangePosts';

type ExchangeBooksResponse = {
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
const fallbackPhotoColors = ['#EAF2FF', '#F4D35E', '#A78BFA', '#7DE3A5'];

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'BS';

const buildExchangeQuery = ({ category }: { category: string }) => {
    const params = new URLSearchParams({
        type: 'exchange',
        page: '1',
        limit: '50',
    });

    if (category !== 'All Categories') {
        params.set('category', category);
    }

    return params.toString();
};

export const fetchExchangeBooks = (filters: { category: string }) =>
    apiRequest<ExchangeBooksResponse>(`/books?${buildExchangeQuery(filters)}`);

export const mapBackendBookToExchangePost = (post: BackendBookPost, index: number): ExchangePost => {
    const sellerName = post.owner?.name || 'Boi Station Reader';

    return {
        id: post._id,
        offeredTitle: post.title,
        offeredAuthor: post.author,
        wantedTitle: post.wantedBook?.title || 'Wanted book',
        wantedAuthor: post.wantedBook?.author || 'Any author',
        category: post.category,
        location: post.location,
        sellerName,
        sellerInitials: getInitials(sellerName),
        sellerColor: avatarColors[index % avatarColors.length],
        exchanged: post.status === 'exchanged',
        offeredCoverUrl: post.officialBook?.coverUrl || post.frontImage?.url,
        wantedCoverUrl: post.wantedBook?.officialBook?.coverUrl || post.wantedBook?.frontImage?.url,
        offeredCoverColor: '#F7F2E8',
        wantedCoverColor: '#EAF2FF',
        photoColors: fallbackPhotoColors,
        photoUrls: post.sellerImages?.map((image) => image.url).filter(Boolean),
    };
};
