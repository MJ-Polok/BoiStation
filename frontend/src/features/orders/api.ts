import { apiRequest } from '../../lib/auth';
import type { BackendBookPost } from '../book-details/api';
import type { UploadedImage } from '../post/api';

export type ContactInfo = {
    contactName: string;
    phone: string;
    division: string;
    district: string;
    upazila: string;
    area: string;
    address: string;
    note?: string;
};

export type BuyerProposedBook = {
    title: string;
    author: string;
    condition: string;
    photos: UploadedImage[];
    conditionNote?: string;
};

export type OrderStatus =
    | 'requested'
    | 'seller_accepted'
    | 'seller_rejected'
    | 'admin_review'
    | 'pickup_assigned'
    | 'picked_up'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';

export type OrderRecord = {
    _id: string;
    type: 'sell' | 'exchange';
    bookPost: BackendBookPost;
    seller: {
        _id?: string;
        id?: string;
        name: string;
        username?: string;
        location?: string;
    };
    buyer: {
        _id?: string;
        id?: string;
        name: string;
        username?: string;
        location?: string;
    };
    sellerPickupInfo: ContactInfo;
    buyerDeliveryInfo: ContactInfo;
    buyerProposedBook?: BuyerProposedBook;
    sellerDecision: {
        status: 'pending' | 'accepted' | 'rejected' | 'not_required';
        note?: string;
        decidedAt?: string;
    };
    status: OrderStatus;
    adminNote?: string;
    deliveryAgent?: {
        name?: string;
        phone?: string;
    };
    createdAt: string;
    updatedAt: string;
};

export type CreateOrderPayload = {
    bookPostId: string;
    buyerDeliveryInfo: ContactInfo;
    buyerProposedBook?: BuyerProposedBook;
};

export const createOrder = (payload: CreateOrderPayload) =>
    apiRequest<{ success: boolean; data: OrderRecord }>('/orders', {
        method: 'POST',
        auth: true,
        body: JSON.stringify(payload),
    });

export const getMyOrders = () =>
    apiRequest<{ success: boolean; data: { buying: OrderRecord[]; selling: OrderRecord[] } }>('/orders/me', {
        auth: true,
    });

export const updateSellerDecision = (orderId: string, payload: { decision: 'accepted' | 'rejected'; note?: string }) =>
    apiRequest<{ success: boolean; data: OrderRecord }>(`/orders/${orderId}/seller-decision`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
    });

export const cancelOrder = (orderId: string, note?: string) =>
    apiRequest<{ success: boolean; data: OrderRecord }>(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ note }),
    });

export const getAdminOrders = () =>
    apiRequest<{ success: boolean; data: OrderRecord[] }>('/orders/admin', {
        auth: true,
    });

export const updateAdminOrderStatus = (
    orderId: string,
    payload: {
        status: OrderStatus;
        note?: string;
        adminNote?: string;
        deliveryAgent?: {
            name?: string;
            phone?: string;
        };
    },
) =>
    apiRequest<{ success: boolean; data: OrderRecord }>(`/orders/${orderId}/admin-status`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
    });
