import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Chip,
  Fab,
} from '@mui/material';
import {
  Add,
  ThumbUp,
  ThumbUpOutlined,
  Comment,
  Share,
  MoreVert,
} from '@mui/icons-material';

const CommunityScreen: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  // Mock data
  const posts = [
    {
      id: '1',
      author: 'Priya Mehta',
      school: 'Delhi Public School',
      avatar: null,
      content: 'Just tried the new visual math technique from the training module. My Class 4 students finally understood fractions! 🎉 The key was using pizza slices as examples.',
      subject: 'Mathematics',
      grade: 'Class 4',
      likes: 24,
      comments: 8,
      timestamp: '2 hours ago',
      tags: ['mathematics', 'visual-learning', 'fractions'],
    },
    {
      id: '2',
      author: 'Rajesh Kumar',
      school: 'Government Primary School',
      avatar: null,
      content: 'Struggling with classroom management in my Class 5. Students are very energetic after lunch break. Any suggestions for calming activities?',
      subject: 'General',
      grade: 'Class 5',
      likes: 12,
      comments: 15,
      timestamp: '4 hours ago',
      tags: ['classroom-management', 'help-needed'],
    },
    {
      id: '3',
      author: 'Sunita Sharma',
      school: 'Kendriya Vidyalaya',
      avatar: null,
      content: 'Amazing science experiment today! Made a volcano with baking soda and vinegar. Students were so engaged they forgot it was learning time 😄',
      subject: 'Science',
      grade: 'Class 3',
      likes: 31,
      comments: 6,
      timestamp: '1 day ago',
      tags: ['science', 'experiments', 'engagement'],
    },
  ];

  const toggleLike = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return '#FF7043';
      case 'Science': return '#26A69A';
      case 'English': return '#5C6BC0';
      default: return '#757575';
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#5C6BC0', minHeight: 64 }}>
        <Toolbar sx={{ minHeight: 64 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Teacher Community
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Community Stats */}
      <Card sx={{ m: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Community Highlights
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <Box>
              <Typography variant="h5" color="primary" fontWeight="bold">
                1,247
              </Typography>
              <Typography variant="caption">Active Teachers</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="secondary" fontWeight="bold">
                89
              </Typography>
              <Typography variant="caption">Posts Today</Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: '#FFD700' }} fontWeight="bold">
                156
              </Typography>
              <Typography variant="caption">Solutions Shared</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

              {/* Posts */}
              <Box sx={{ px: 2, pb: 2 }}>
        {posts.map((post) => (
          <Card key={post.id} sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent>
              {/* Post Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: getSubjectColor(post.subject), mr: 2 }}>
                  {post.author.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {post.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.school} • {post.timestamp}
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>

              {/* Post Content */}
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.content}
              </Typography>

              {/* Tags */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  size="small"
                  label={post.subject}
                  sx={{
                    backgroundColor: getSubjectColor(post.subject),
                    color: 'white',
                  }}
                />
                <Chip
                  size="small"
                  label={post.grade}
                  variant="outlined"
                />
                {post.tags.slice(0, 2).map((tag, index) => (
                  <Chip
                    key={index}
                    size="small"
                    label={tag}
                    variant="outlined"
                  />
                ))}
              </Box>

              {/* Post Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    size="small"
                    startIcon={
                      likedPosts.includes(post.id) ? <ThumbUp /> : <ThumbUpOutlined />
                    }
                    onClick={() => toggleLike(post.id)}
                    sx={{
                      color: likedPosts.includes(post.id) ? '#FF7043' : 'text.secondary',
                    }}
                  >
                    {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Comment />}
                    sx={{ color: 'text.secondary' }}
                  >
                    {post.comments}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Share />}
                    sx={{ color: 'text.secondary' }}
                  >
                    Share
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Load More Posts
        </Button>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 16,
          backgroundColor: '#5C6BC0',
          '&:hover': { backgroundColor: '#3F51B5' },
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default CommunityScreen;