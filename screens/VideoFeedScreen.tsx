import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoFeed } from '../components/video/VideoFeed';
import { CommentsModal } from '../components/video/CommentsModal';
import { ThemeContext } from '../context/ThemeContext';
import { videoAPI, VideoItem, VideoComment } from '../services/videoAPI';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isSmallScreen = SCREEN_WIDTH < 375;

// Sample videos for testing - Using food/cooking videos
const dummyVideos = [
  {
    id: '1',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    restaurantName: 'Nyama Choma House',
    dishName: 'Grilled Goat Meat with Kachumbari',
    likes: 1234,
    comments: 89,
    shares: 45,
    isLiked: false,
    creator: 'chef_john',
    location: 'Westlands, Nairobi',
  },
  {
    id: '2',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    restaurantName: 'Pilau Paradise',
    dishName: 'Coastal Pilau with Kachumbari',
    likes: 2345,
    comments: 156,
    shares: 78,
    isLiked: true,
    creator: 'foodie_kenya',
    location: 'Mombasa Road',
  },
  {
    id: '3',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    restaurantName: 'Ugali Masters',
    dishName: 'Traditional Ugali & Sukuma Wiki',
    likes: 890,
    comments: 34,
    shares: 12,
    isLiked: false,
    creator: 'kenyan_kitchen',
    location: 'Kibera, Nairobi',
  },
];

const VideoFeedScreen = ({ navigation }: any) => {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'forYou' | 'nearby' | 'following'>('forYou');
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get user location for nearby feed
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  // Load videos based on active tab
  useEffect(() => {
    loadVideos();
  }, [activeTab, location]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const feedType = activeTab === 'forYou' ? 'for_you' : activeTab === 'nearby' ? 'nearby' : 'following';
      
      const params: any = {
        feedType,
        page: 1,
        limit: 20,
      };

      if (feedType === 'nearby' && location) {
        params.latitude = location.latitude;
        params.longitude = location.longitude;
      }

      const response = await videoAPI.getVideos(params);
      
      // Transform backend videos to frontend format
      const transformedVideos = response.videos.map((video: VideoItem) => ({
        id: video.id,
        uri: video.videoUrl,
        restaurantName: video.restaurant?.name || 'Unknown Restaurant',
        dishName: video.dishName || video.title || 'Delicious Food',
        likes: video.likesCount,
        comments: video.commentsCount,
        shares: video.sharesCount,
        isLiked: video.isLiked,
        creator: video.user.name,
        location: video.location || video.restaurant?.name,
      }));

      setVideos(transformedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      // Fallback to dummy data
      setVideos(dummyVideos);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    try {
      // Optimistic update
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked: !video.isLiked, 
              likes: video.isLiked ? video.likes - 1 : video.likes + 1 
            }
          : video
      ));

      // Call API
      const result = await videoAPI.toggleLike(videoId);
      
      // Update with actual result
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked: result.isLiked, 
              likes: result.likesCount 
            }
          : video
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked: !video.isLiked, 
              likes: video.isLiked ? video.likes + 1 : video.likes - 1 
            }
          : video
      ));
    }
  };

  const handleComment = async (videoId: string) => {
    setSelectedVideoId(videoId);
    setCommentsVisible(true);
    await loadComments(videoId);
  };

  const loadComments = async (videoId: string) => {
    try {
      setLoadingComments(true);
      const response = await videoAPI.getComments(videoId);
      setComments(response.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async (text: string) => {
    if (!selectedVideoId) return;

    try {
      const newComment = await videoAPI.addComment(selectedVideoId, text);
      setComments([newComment, ...comments]);
      
      // Update video comment count
      setVideos(videos.map(video => 
        video.id === selectedVideoId 
          ? { ...video, comments: video.comments + 1 }
          : video
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleLikeComment = (commentId: string) => {
    // TODO: Implement comment like API
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likesCount: comment.likesCount + 1 }
        : comment
    ));
  };

  const handleShare = async (videoId: string) => {
    try {
      await videoAPI.shareVideo(videoId);
      
      // Update share count
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, shares: video.shares + 1 }
          : video
      ));

      // TODO: Implement WhatsApp share
      Alert.alert('Share', 'Video shared! (WhatsApp integration coming soon)');
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };

  const handleFollow = (creatorId: string) => {
    // TODO: Implement follow API
    console.log('Follow creator:', creatorId);
    Alert.alert('Follow', 'Follow feature coming soon!');
  };

  const handleTabChange = (tab: 'forYou' | 'nearby' | 'following') => {
    setActiveTab(tab);
  };

  if (loading && videos.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: '#000000' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={[styles.loadingText, { color: 'rgba(255, 255, 255, 0.6)' }]}>
          Loading videos...
        </Text>
      </View>
    );
  }

  // Calculate responsive values
  const tabFontSize = isTablet ? 16 : isSmallScreen ? 12 : 14;
  const tabPadding = isTablet ? 12 : isSmallScreen ? 6 : 8;
  const tabBarPaddingTop = Platform.OS === 'ios' ? (isTablet ? 60 : 50) : (isTablet ? 50 : 45);
  const indicatorWidth = isTablet ? 40 : isSmallScreen ? 20 : 30;

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Compact Tab Bar - TikTok Style - Responsive */}
      <View style={[styles.tabBar, { paddingTop: tabBarPaddingTop }]}>
        <TouchableOpacity
          style={[styles.tab, { paddingVertical: tabPadding }]}
          onPress={() => handleTabChange('forYou')}
        >
          <Text style={[
            styles.tabText,
            { 
              fontSize: tabFontSize,
              color: activeTab === 'forYou' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTab === 'forYou' ? '700' : '400'
            }
          ]}>
            For You
          </Text>
          {activeTab === 'forYou' && (
            <View style={[styles.tabIndicator, { width: indicatorWidth, marginLeft: -indicatorWidth / 2 }]} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, { paddingVertical: tabPadding }]}
          onPress={() => handleTabChange('nearby')}
        >
          <Text style={[
            styles.tabText,
            { 
              fontSize: tabFontSize,
              color: activeTab === 'nearby' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTab === 'nearby' ? '700' : '400'
            }
          ]}>
            Nearby
          </Text>
          {activeTab === 'nearby' && (
            <View style={[styles.tabIndicator, { width: indicatorWidth, marginLeft: -indicatorWidth / 2 }]} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, { paddingVertical: tabPadding }]}
          onPress={() => handleTabChange('following')}
        >
          <Text style={[
            styles.tabText,
            { 
              fontSize: tabFontSize,
              color: activeTab === 'following' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTab === 'following' ? '700' : '400'
            }
          ]}>
            Following
          </Text>
          {activeTab === 'following' && (
            <View style={[styles.tabIndicator, { width: indicatorWidth, marginLeft: -indicatorWidth / 2 }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Video Feed */}
      {videos.length > 0 ? (
        <VideoFeed
          videos={videos}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onFollow={handleFollow}
        />
      ) : (
        <View style={[styles.centerContent, { backgroundColor: '#000000' }]}>
          <Text style={[styles.emptyText, { color: 'rgba(255, 255, 255, 0.6)' }]}>
            No videos available
          </Text>
        </View>
      )}

      {/* Comments Modal */}
      <CommentsModal
        visible={commentsVisible}
        videoId={selectedVideoId || ''}
        comments={comments}
        loading={loadingComments}
        onClose={() => {
          setCommentsVisible(false);
          setSelectedVideoId(null);
          setComments([]);
        }}
        onSubmitComment={handleSubmitComment}
        onLikeComment={handleLikeComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    zIndex: 10,
    maxWidth: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 0, // Allow flex to shrink
    maxWidth: SCREEN_WIDTH / 3, // Ensure tabs fit within screen
  },
  tabText: {
    letterSpacing: 0.5,
    textAlign: 'center',
    includeFontPadding: false, // Remove extra padding
    textAlignVertical: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default VideoFeedScreen;

