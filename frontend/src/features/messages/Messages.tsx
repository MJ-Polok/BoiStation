import { ArrowLeft, ArrowRight, BookOpen, MessageCircle, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { ChatMessage, Conversation } from './data/conversations';
import { useMockAuth } from '../../hooks/useMockAuth';
import {
    createConversation,
    listConversations,
    listMessages,
    markConversationRead,
    sendConversationMessage,
    type BackendConversation,
    type BackendMessage,
} from './api';
import { getMessageSocket } from './socket';

const avatarColors = ['#7DE3A5', '#93C5FD', '#A78BFA', '#F4D35E', '#F9735B'];

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'BS';

const formatMessageTime = (date?: string) => {
    if (!date) return 'Now';

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'Now';

    return parsedDate.toLocaleTimeString('en-BD', {
        hour: 'numeric',
        minute: '2-digit',
    });
};

const formatBookStatus = (conversation: BackendConversation) => {
    if (!conversation.bookPost) return 'Book unavailable';
    if (conversation.bookPost.type === 'exchange') return 'Exchange';
    if (typeof conversation.bookPost.price === 'number') return `৳${conversation.bookPost.price}`;
    return 'For Sale';
};

const getOtherUser = (conversation: BackendConversation, currentUserId?: string) => {
    const buyerId = conversation.buyer.id || conversation.buyer._id;
    return buyerId === currentUserId ? conversation.seller : conversation.buyer;
};

const mapBackendConversation = (
    conversation: BackendConversation,
    currentUserId?: string,
    index = 0,
): Conversation => {
    const otherUser = getOtherUser(conversation, currentUserId);
    const unreadCount = conversation.readBy?.includes(currentUserId || '') ? 0 : conversation.lastMessage ? 1 : 0;

    return {
        id: conversation._id,
        userName: otherUser.name,
        initials: getInitials(otherUser.name),
        avatarColor: avatarColors[index % avatarColors.length],
        bookId: conversation.bookPost?._id || conversation.bookPost?.id || '',
        bookTitle: conversation.bookPost?.title || 'Book unavailable',
        bookAuthor: conversation.bookPost?.author || 'Unknown author',
        bookStatus: formatBookStatus(conversation),
        coverUrl: conversation.bookPost?.frontImage?.url,
        coverColor: '#F7F4EC',
        location: otherUser.location || 'Location not set',
        lastMessage: conversation.lastMessage || 'Start the conversation about this book.',
        lastTime: formatMessageTime(conversation.lastMessageAt || conversation.updatedAt),
        unreadCount,
        messages: [],
    };
};

const mapBackendMessage = (message: BackendMessage, currentUserId?: string): ChatMessage => {
    const senderId = message.sender?.id || message.sender?._id;

    return {
        id: message._id,
        sender: message.type === 'system' ? 'system' : senderId === currentUserId ? 'me' : 'other',
        text: message.text,
        time: formatMessageTime(message.createdAt),
    };
};

const getSystemMessage = (conversationId: string): ChatMessage => ({
    id: `${conversationId}-system`,
    sender: 'system',
    text: 'Order and delivery should be confirmed before payment.',
    time: 'Now',
});

const Avatar = ({ color, initials }: { color: string; initials: string }) => (
    <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white text-sm font-extrabold text-[#111827] shadow-[0_8px_18px_rgba(17,24,39,0.10)]"
        style={{ backgroundColor: color }}
    >
        {initials}
    </span>
);

const BookThumb = ({ conversation }: { conversation: Conversation }) => (
    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md border border-[#D6CCBA] bg-[#F7F4EC] p-1">
        {conversation.coverUrl ? (
            <img
                className="h-full w-full rounded-sm border border-[#111827] object-cover"
                src={conversation.coverUrl}
                alt={`${conversation.bookTitle} cover`}
                loading="lazy"
            />
        ) : (
            <div
                className="grid h-full place-items-center rounded-sm border border-[#111827]"
                style={{ backgroundColor: conversation.coverColor }}
            >
                <BookOpen size={19} strokeWidth={2} />
            </div>
        )}
    </div>
);

const ConversationItem = ({
    conversation,
    isActive,
    onSelect,
}: {
    conversation: Conversation;
    isActive: boolean;
    onSelect: () => void;
}) => (
    <button
        className={`w-full border-b border-[#E8DFD1] p-4 text-left transition last:border-b-0 ${
            isActive ? 'bg-[#F4EFE6]' : 'bg-[#FFFDF8] hover:bg-[#F7F4EC]'
        }`}
        onClick={onSelect}
        type="button"
    >
        <div className="flex gap-3">
            <Avatar color={conversation.avatarColor} initials={conversation.initials} />
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p
                            className={`truncate text-sm ${
                                conversation.unreadCount ? 'font-extrabold text-[#111827]' : 'font-bold text-[#111827]'
                            }`}
                        >
                            {conversation.userName}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-[#626B78]">{conversation.bookTitle}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="text-xs font-bold text-[#8A8173]">{conversation.lastTime}</span>
                        {conversation.unreadCount > 0 && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#F9735B] px-1.5 text-[11px] font-extrabold text-white">
                                {conversation.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
                <p
                    className={`mt-3 line-clamp-2 text-sm leading-5 ${
                        conversation.unreadCount ? 'font-bold text-[#111827]' : 'font-medium text-[#626B78]'
                    }`}
                >
                    {conversation.lastMessage}
                </p>
            </div>
        </div>
    </button>
);

const MessageBubble = ({ message }: { message: ChatMessage }) => {
    if (message.sender === 'system') {
        return (
            <div className="mx-auto max-w-md rounded-full bg-[#FFF3D6] px-4 py-2 text-center text-xs font-bold text-[#7C4A03]">
                {message.text}
            </div>
        );
    }

    const isMine = message.sender === 'me';

    return (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                    isMine ? 'rounded-br-md bg-[#111827] text-white' : 'rounded-bl-md bg-[#F7F4EC] text-[#111827]'
                }`}
            >
                <p className="text-sm font-semibold leading-6">{message.text}</p>
                <p className={`mt-1 text-[11px] font-bold ${isMine ? 'text-white/60' : 'text-[#8A8173]'}`}>
                    {message.time}
                </p>
            </div>
        </div>
    );
};

const ChatWindow = ({
    conversation,
    messages,
    onBack,
    onSend,
}: {
    conversation: Conversation;
    messages: ChatMessage[];
    onBack: () => void;
    onSend: (text: string) => void;
}) => {
    const [draft, setDraft] = useState('');

    const sendMessage = () => {
        const text = draft.trim();

        if (!text) {
            return;
        }

        onSend(text);
        setDraft('');
    };

    return (
        <section className="flex min-h-[620px] min-w-0 flex-col bg-white lg:min-h-[700px]">
            <header className="flex items-center gap-3 border-b border-[#E8DFD1] px-4 py-4 sm:px-5">
                <button
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#D6CCBA] text-[#111827] lg:hidden"
                    onClick={onBack}
                    type="button"
                    aria-label="Back to conversations"
                >
                    <ArrowLeft size={18} strokeWidth={2.4} />
                </button>
                <Avatar color={conversation.avatarColor} initials={conversation.initials} />
                <div className="min-w-0">
                    <h2 className="truncate font-sora text-xl font-extrabold text-[#111827]">
                        {conversation.userName}
                    </h2>
                    <p className="truncate text-sm font-bold text-[#626B78]">About {conversation.bookTitle}</p>
                </div>
            </header>

            <div className="border-b border-[#E8DFD1] bg-[#FFFDF8] p-4 sm:p-5">
                <div className="flex items-center gap-4 rounded-lg border border-[#D6CCBA] bg-white p-3">
                    <BookThumb conversation={conversation} />
                    <div className="min-w-0 flex-1">
                        <h3 className="font-sora truncate text-lg font-extrabold text-[#111827]">
                            {conversation.bookTitle}
                        </h3>
                        <p className="mt-1 truncate text-sm font-bold text-[#626B78]">{conversation.bookAuthor}</p>
                        <p className="mt-2 text-sm font-extrabold text-[#111827]">{conversation.bookStatus}</p>
                    </div>
                    <Link
                        className="hidden shrink-0 items-center gap-2 rounded-full border border-[#D6CCBA] px-4 py-2 text-sm font-extrabold text-[#111827] transition hover:border-[#111827] sm:inline-flex"
                        to={`/books/${conversation.bookId}`}
                    >
                        View Book
                        <ArrowRight size={15} strokeWidth={2.4} />
                    </Link>
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-white p-4 sm:p-6">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
            </div>

            <footer className="border-t border-[#E8DFD1] bg-[#FFFDF8] p-4">
                <div className="flex items-center gap-3 rounded-full border border-[#D6CCBA] bg-white p-2 pl-5">
                    <input
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#8A8173]"
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        placeholder="Write a message..."
                        value={draft}
                    />
                    <button
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#111827] text-white transition hover:bg-[#1F2937]"
                        onClick={sendMessage}
                        type="button"
                        aria-label="Send message"
                    >
                        <Send size={17} strokeWidth={2.4} />
                    </button>
                </div>
            </footer>
        </section>
    );
};

const Messages = () => {
    const [searchParams] = useSearchParams();
    const { currentUser } = useMockAuth();
    const currentUserId = currentUser?.id;
    const queryConversationId = searchParams.get('conversation');
    const queryBookId = searchParams.get('book');
    const [conversationList, setConversationList] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState(queryConversationId || '');
    const [mobileChatOpen, setMobileChatOpen] = useState(false);
    const [messageMap, setMessageMap] = useState<Record<string, ChatMessage[]>>({});
    const [loadedMessageIds, setLoadedMessageIds] = useState<Set<string>>(() => new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [sendError, setSendError] = useState('');

    const activeConversation = useMemo(
        () => conversationList.find((conversation) => conversation.id === activeId),
        [activeId, conversationList],
    );

    useEffect(() => {
        let isActive = true;
        setIsLoading(true);
        setLoadError('');

        listConversations()
            .then((response) => {
                if (!isActive) return;

                const mappedConversations = response.data.map((conversation, index) =>
                    mapBackendConversation(conversation, currentUserId, index),
                );

                setConversationList(mappedConversations);
                setActiveId((existingActiveId) => queryConversationId || existingActiveId || mappedConversations[0]?.id || '');
                setMobileChatOpen(Boolean(queryConversationId));
                setMessageMap((messages) => ({
                    ...messages,
                    ...mappedConversations.reduce<Record<string, ChatMessage[]>>((acc, conversation) => {
                        if (messages[conversation.id]) {
                            acc[conversation.id] = messages[conversation.id];
                        }
                        return acc;
                    }, {}),
                }));
            })
            .catch((error) => {
                if (!isActive) return;

                setConversationList([]);
                setActiveId('');
                setMobileChatOpen(false);
                setMessageMap({});
                setLoadError(error instanceof Error ? error.message : 'Could not load conversations.');
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [currentUserId, queryBookId, queryConversationId]);

    useEffect(() => {
        if (!queryBookId || queryConversationId) {
            return;
        }

        let isActive = true;

        createConversation(queryBookId)
            .then((response) => {
                if (!isActive) return;

                const mappedConversation = mapBackendConversation(response.data, currentUserId);
                setConversationList((list) => {
                    const filteredList = list.filter((conversation) => conversation.id !== mappedConversation.id);
                    return [mappedConversation, ...filteredList];
                });
                setActiveId(mappedConversation.id);
                setMobileChatOpen(true);
            })
            .catch(() => undefined);

        return () => {
            isActive = false;
        };
    }, [currentUserId, queryBookId, queryConversationId]);

    useEffect(() => {
        if (!activeId || loadedMessageIds.has(activeId)) {
            return;
        }

        let isActive = true;

        listMessages(activeId)
            .then((response) => {
                if (!isActive) return;

                const mappedMessages = response.data.map((message) => mapBackendMessage(message, currentUserId));
                setMessageMap((messages) => ({
                    ...messages,
                    [activeId]: mappedMessages.length ? mappedMessages : [getSystemMessage(activeId)],
                }));
                setLoadedMessageIds((ids) => new Set(ids).add(activeId));
                setConversationList((list) =>
                    list.map((conversation) =>
                        conversation.id === activeId
                            ? {
                                  ...conversation,
                                  unreadCount: 0,
                              }
                            : conversation,
                    ),
                );
                markConversationRead(activeId).catch(() => undefined);
            })
            .catch(() => {
                if (!isActive) return;
                setMessageMap((messages) => ({
                    ...messages,
                    [activeId]: messages[activeId] || [getSystemMessage(activeId)],
                }));
                setLoadedMessageIds((ids) => new Set(ids).add(activeId));
            });

        return () => {
            isActive = false;
        };
    }, [activeId, currentUserId, loadedMessageIds]);

    useEffect(() => {
        if (!activeId) return;

        const syncActiveMessages = () => {
            listMessages(activeId)
                .then((response) => {
                    const mappedMessages = response.data.map((message) => mapBackendMessage(message, currentUserId));
                    setMessageMap((messages) => ({
                        ...messages,
                        [activeId]: mappedMessages.length ? mappedMessages : [getSystemMessage(activeId)],
                    }));
                    setLoadedMessageIds((ids) => new Set(ids).add(activeId));
                })
                .catch(() => undefined);
        };

        const intervalId = window.setInterval(syncActiveMessages, 2500);
        return () => window.clearInterval(intervalId);
    }, [activeId, currentUserId]);

    useEffect(() => {
        const syncConversations = () => {
            listConversations()
                .then((response) => {
                    const mappedConversations = response.data.map((conversation, index) =>
                        mapBackendConversation(conversation, currentUserId, index),
                    );

                    setConversationList((currentList) =>
                        mappedConversations.map((conversation) => {
                            const currentConversation = currentList.find((item) => item.id === conversation.id);
                            return {
                                ...conversation,
                                unreadCount: conversation.id === activeId ? 0 : conversation.unreadCount,
                                messages: currentConversation?.messages || conversation.messages,
                            };
                        }),
                    );
                })
                .catch(() => undefined);
        };

        const intervalId = window.setInterval(syncConversations, 4000);
        return () => window.clearInterval(intervalId);
    }, [activeId, currentUserId]);

    useEffect(() => {
        if (!activeId) return;

        const socket = getMessageSocket();
        const roomId = `conversation:${activeId}`;

        socket.emit('conversation:join', activeId);
        socket.emit('conversation:join', roomId);

        const handleNewMessage = ({
            conversation,
            message,
        }: {
            conversation: BackendConversation;
            message: BackendMessage;
        }) => {
            if (conversation._id !== activeId) return;

            const mappedMessage = mapBackendMessage(message, currentUserId);
            const mappedConversation = mapBackendConversation(conversation, currentUserId);

            setMessageMap((messages) => {
                const currentMessages = messages[activeId] || [];

                if (currentMessages.some((item) => item.id === mappedMessage.id)) {
                    return messages;
                }

                return {
                    ...messages,
                    [activeId]: [...currentMessages, mappedMessage],
                };
            });
            setConversationList((list) =>
                list.map((item) =>
                    item.id === activeId
                        ? {
                              ...item,
                              lastMessage: mappedConversation.lastMessage,
                              lastTime: 'Now',
                              unreadCount: mappedMessage.sender === 'me' ? 0 : 1,
                          }
                        : item,
                ),
            );
        };

        socket.on('message:new', handleNewMessage);

        return () => {
            socket.off('message:new', handleNewMessage);
            socket.emit('conversation:leave', activeId);
            socket.emit('conversation:leave', roomId);
        };
    }, [activeId, currentUserId]);

    useEffect(() => {
        const socket = getMessageSocket();

        const handleConversationUpdate = ({
            conversation,
            message,
        }: {
            conversation: BackendConversation;
            message: BackendMessage;
        }) => {
            const mappedConversation = mapBackendConversation(conversation, currentUserId);
            const mappedMessage = mapBackendMessage(message, currentUserId);

            setConversationList((list) => {
                const existingConversation = list.find((item) => item.id === mappedConversation.id);
                const nextConversation = {
                    ...(existingConversation || mappedConversation),
                    lastMessage: mappedConversation.lastMessage,
                    lastTime: 'Now',
                    unreadCount:
                        mappedConversation.id === activeId || mappedMessage.sender === 'me'
                            ? 0
                            : (existingConversation?.unreadCount || 0) + 1,
                };
                const filteredList = list.filter((item) => item.id !== mappedConversation.id);
                return [nextConversation, ...filteredList];
            });

            if (mappedConversation.id !== activeId) {
                return;
            }

            setMessageMap((messages) => {
                const currentMessages = messages[activeId] || [];

                if (currentMessages.some((item) => item.id === mappedMessage.id)) {
                    return messages;
                }

                return {
                    ...messages,
                    [activeId]: [...currentMessages, mappedMessage],
                };
            });
        };

        socket.on('conversation:updated', handleConversationUpdate);

        return () => {
            socket.off('conversation:updated', handleConversationUpdate);
        };
    }, [activeId, currentUserId]);

    const selectConversation = (id: string) => {
        setActiveId(id);
        setMobileChatOpen(true);
    };

    const sendMessage = async (text: string) => {
        if (!activeConversation) {
            return;
        }

        setSendError('');

        try {
            const response = await sendConversationMessage(activeConversation.id, text);
            const message = mapBackendMessage(response.data, currentUserId);

            setMessageMap((messages) => ({
                ...messages,
                [activeConversation.id]: (messages[activeConversation.id] || []).some((item) => item.id === message.id)
                    ? messages[activeConversation.id]
                    : [...(messages[activeConversation.id] || []), message],
            }));
            setConversationList((list) =>
                list.map((conversation) =>
                    conversation.id === activeConversation.id
                        ? {
                              ...conversation,
                              lastMessage: text,
                              lastTime: 'Now',
                              unreadCount: 0,
                          }
                        : conversation,
                ),
            );
        } catch (error) {
            setSendError(error instanceof Error ? error.message : 'Could not send this message.');
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[#FBF8F1] px-4 py-8 text-[#111827] sm:px-6 lg:px-8 lg:py-12">
                <div className="mx-auto max-w-7xl rounded-lg border border-[#D6CCBA] bg-white p-8 shadow-[0_16px_38px_rgba(17,24,39,0.05)]">
                    <div className="h-7 w-28 animate-pulse rounded-full bg-[#F0E7D8]" />
                    <div className="mt-6 h-[520px] animate-pulse rounded-lg bg-[#F7F4EC]" />
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#FBF8F1] px-4 py-8 text-[#111827] sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <div className="border-b border-[#D6CCBA] pb-6">
                    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#8A8173]">Inbox</p>
                    <h1 className="font-sora mt-2 text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl">
                        Messages
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#626B78]">
                        Talk with readers and sellers about saved or posted books.
                    </p>
                </div>

                {loadError ? (
                    <p className="mt-5 rounded-lg border border-[#FCD34D] bg-[#FFF7D8] px-4 py-3 text-sm font-bold text-[#7C4A03]">
                        {loadError}
                    </p>
                ) : null}

                {conversationList.length > 0 ? (
                    <div className="mt-8 overflow-hidden rounded-lg border border-[#D6CCBA] bg-[#FFFDF8] shadow-[0_16px_38px_rgba(17,24,39,0.05)] lg:grid lg:grid-cols-[360px_minmax(0,1fr)]">
                        <aside className={`${mobileChatOpen ? 'hidden lg:block' : 'block'} border-[#E8DFD1] lg:border-r`}>
                            <div className="border-b border-[#E8DFD1] p-4">
                                <h2 className="font-sora text-xl font-extrabold text-[#111827]">Conversations</h2>
                                <p className="mt-1 text-sm font-bold text-[#626B78]">
                                    {conversationList.length} active chats
                                </p>
                            </div>
                            <div>
                                {conversationList.map((conversation) => (
                                    <ConversationItem
                                        conversation={conversation}
                                        isActive={conversation.id === activeId}
                                        key={conversation.id}
                                        onSelect={() => selectConversation(conversation.id)}
                                    />
                                ))}
                            </div>
                        </aside>

                        <div className={`${mobileChatOpen ? 'block' : 'hidden lg:block'}`}>
                            {activeConversation ? (
                                <>
                                    <ChatWindow
                                        conversation={activeConversation}
                                        messages={messageMap[activeConversation.id] || [getSystemMessage(activeConversation.id)]}
                                        onBack={() => setMobileChatOpen(false)}
                                        onSend={sendMessage}
                                    />
                                    {sendError ? (
                                        <p className="border-t border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                            {sendError}
                                        </p>
                                    ) : null}
                                </>
                            ) : (
                                <section className="grid min-h-[620px] place-items-center bg-white p-8 text-center">
                                    <div>
                                        <MessageCircle className="mx-auto text-[#8A8173]" size={38} strokeWidth={1.8} />
                                        <h2 className="font-sora mt-4 text-2xl font-extrabold text-[#111827]">
                                            Select a conversation
                                        </h2>
                                        <p className="mt-2 text-sm font-bold text-[#626B78]">
                                            Choose a message to view the chat.
                                        </p>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                ) : (
                    <section className="mt-8 rounded-lg border border-[#D6CCBA] bg-white p-8 text-center shadow-[0_14px_34px_rgba(17,24,39,0.04)]">
                        <MessageCircle className="mx-auto text-[#8A8173]" size={40} strokeWidth={1.8} />
                        <h2 className="font-sora mt-5 text-3xl font-extrabold text-[#111827]">No messages yet</h2>
                        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-[#626B78]">
                            Start a conversation from a book post.
                        </p>
                        <Link
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#1F2937]"
                            to="/buy-sell"
                        >
                            Browse Books
                            <ArrowRight size={17} strokeWidth={2.4} />
                        </Link>
                    </section>
                )}
            </div>
        </main>
    );
};

export default Messages;
