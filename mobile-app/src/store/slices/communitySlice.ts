import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  subject?: string;
  grade?: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

interface CommunityState {
  posts: CommunityPost[];
  comments: {[postId: string]: Comment[]};
  currentPost: CommunityPost | null;
  loading: boolean;
  error: string | null;
  filters: {
    subject?: string;
    grade?: string;
    tag?: string;
    sortBy?: 'recent' | 'popular' | 'trending';
  };
}

const initialState: CommunityState = {
  posts: [],
  comments: {},
  currentPost: null,
  loading: false,
  error: null,
  filters: {
    sortBy: 'recent',
  },
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPosts: (state, action: PayloadAction<CommunityPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<CommunityPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<CommunityPost>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
      delete state.comments[action.payload];
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isBookmarked = !post.isBookmarked;
      }
    },
    setCurrentPost: (state, action: PayloadAction<CommunityPost | null>) => {
      state.currentPost = action.payload;
    },
    setComments: (
      state,
      action: PayloadAction<{postId: string; comments: Comment[]}>,
    ) => {
      state.comments[action.payload.postId] = action.payload.comments;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      const {postId} = action.payload;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      state.comments[postId].push(action.payload);

      // Update comment count in post
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.comments += 1;
      }
    },
    toggleCommentLike: (
      state,
      action: PayloadAction<{postId: string; commentId: string}>,
    ) => {
      const {postId, commentId} = action.payload;
      const comments = state.comments[postId];
      if (comments) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likes += comment.isLiked ? 1 : -1;
        }
      }
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  setCurrentPost,
  setComments,
  addComment,
  toggleCommentLike,
  setFilters,
  clearError,
} = communitySlice.actions;

export default communitySlice.reducer;
