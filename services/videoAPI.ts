import api from './api';

export interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  dishName?: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  restaurant?: {
    id: string;
    name: string;
    image?: string;
  };
  menuItem?: {
    id: string;
    name: string;
    image?: string;
  };
  filter?: string;
  hasTextOverlay: boolean;
  textOverlay?: string;
  feedType: 'for_you' | 'nearby' | 'following' | 'trending';
  createdAt: string;
}

export interface VideoComment {
  id: string;
  content: string;
  likesCount: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  replies?: VideoComment[];
}

export interface CreateVideoRequest {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  dishName?: string;
  location?: string;
  restaurantId?: string;
  menuItemId?: string;
  filter?: string;
  textOverlay?: string;
  feedType?: 'for_you' | 'nearby' | 'following' | 'trending';
  latitude?: number;
  longitude?: number;
}

export const videoAPI = {
  // Get videos for feed
  getVideos: async (params: {
    feedType?: 'for_you' | 'nearby' | 'following' | 'trending';
    page?: number;
    limit?: number;
    latitude?: number;
    longitude?: number;
  } = {}): Promise<{ videos: VideoItem[]; pagination: any }> => {
    const response = await api.get('/videos', { params });
    return response.data.data;
  },

  // Get single video
  getVideo: async (id: string): Promise<VideoItem> => {
    const response = await api.get(`/videos/${id}`);
    return response.data.data;
  },

  // Create video
  createVideo: async (videoData: CreateVideoRequest): Promise<VideoItem> => {
    const response = await api.post('/videos', videoData);
    return response.data.data;
  },

  // Like/Unlike video
  toggleLike: async (videoId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data.data;
  },

  // Get video comments
  getComments: async (
    videoId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<{ comments: VideoComment[]; pagination: any }> => {
    const response = await api.get(`/videos/${videoId}/comments`, { params });
    return response.data.data;
  },

  // Add comment
  addComment: async (
    videoId: string,
    content: string,
    parentCommentId?: string
  ): Promise<VideoComment> => {
    const response = await api.post(`/videos/${videoId}/comment`, {
      content,
      parentCommentId,
    });
    return response.data.data;
  },

  // Share video
  shareVideo: async (videoId: string): Promise<{ sharesCount: number }> => {
    const response = await api.post(`/videos/${videoId}/share`);
    return response.data.data;
  },
};

