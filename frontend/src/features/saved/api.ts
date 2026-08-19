import { apiRequest } from '../../lib/auth';
import type { BackendBookPost } from '../book-details/api';
import type { SavedBook } from './data/savedBooks';

type BackendSavedBook = {
    _id: string;
    bookPost: BackendBookPost | null;
    createdAt: string;
};

const formatPrice = (book: BackendBookPost) => {
    if (book.type === 'exchange') return 'Exchange';
    if (typeof book.price === 'number') return `৳${book.price}`;
    return 'For Sale';
};

export const mapBackendSavedBook = (saved: BackendSavedBook): SavedBook | null => {
    const book = saved.bookPost;
    if (!book) return null;

    return {
        id: book._id,
        title: book.title,
        author: book.author,
        type: book.type === 'exchange' ? 'Exchange' : 'For Sale',
        condition: book.condition as SavedBook['condition'],
        priceLabel: formatPrice(book),
        location: book.location,
        category: book.category,
        coverUrl: book.officialBook?.coverUrl || book.frontImage?.url,
        coverColor: '#F7F4EC',
        accentColor: book.type === 'exchange' ? '#93C5FD' : '#7DE3A5',
    };
};

export const listSavedBooks = () =>
    apiRequest<{ success: boolean; data: BackendSavedBook[] }>('/saved', {
        auth: true,
    });

export const saveBook = (bookId: string) =>
    apiRequest<{ success: boolean; data: BackendSavedBook }>(`/saved/${bookId}`, {
        method: 'POST',
        auth: true,
    });

export const removeSavedBook = (bookId: string) =>
    apiRequest<{ success: boolean; message: string }>(`/saved/${bookId}`, {
        method: 'DELETE',
        auth: true,
    });

export const isBookSaved = async (bookId: string) => {
    const response = await listSavedBooks();
    return response.data.some((saved) => saved.bookPost?._id === bookId);
};
