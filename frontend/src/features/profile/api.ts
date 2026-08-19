import { apiRequest, setAuthSession, getAuthToken, type AuthUser } from '../../lib/auth';
import type { BackendBookPost } from '../book-details/api';

type ProfileResponse = {
    success: boolean;
    data: BackendProfileUser;
};

type ProfilePostsResponse = {
    success: boolean;
    data: BackendBookPost[];
};

type UpdateProfilePayload = {
    name: string;
    username: string;
    location: string;
    bio: string;
};

export type BackendProfileUser = AuthUser & {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
};

export const getProfile = (id: string) => apiRequest<ProfileResponse>(`/users/${id}`);

export const getProfilePosts = (id: string) => apiRequest<ProfilePostsResponse>(`/users/${id}/posts`);

export const updateMyProfile = async (payload: UpdateProfilePayload) => {
    const response = await apiRequest<{ success: boolean; data: AuthUser }>('/users/me', {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
    });

    const token = getAuthToken();
    if (token) {
        setAuthSession({ token, user: response.data });
    }

    return response;
};

export const removeMyBookPost = (id: string) =>
    apiRequest<{ success: boolean; data: BackendBookPost }>(`/books/${id}/status`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ status: 'unavailable' }),
    });
