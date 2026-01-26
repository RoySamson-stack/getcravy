import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { HeartAnimation } from './HeartAnimation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isSmallScreen = SCREEN_WIDTH < 375;

export interface VideoItem {
  id: string;
  uri: string;
  restaurantName: string;
  dishName: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  creator: string;
  location?: string;
}

interface VideoItemComponentProps {
  item: VideoItem;
  index: number;
  isPlaying: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onFollow: () => void;
  onDoubleTap: () => void;
  showHeart: boolean;
  onHeartComplete: () => void;
}

// Format numbers like TikTok (1.2K, 1.5M)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const VideoItemComponent: React.FC<VideoItemComponentProps> = ({
  item,
  index,
  isPlaying,
  onLike,
  onComment,
  onShare,
  onFollow,
  onDoubleTap,
  showHeart,
  onHeartComplete,
}) => {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  
  // TikTok exact measurements
  const overlayPadding = 16;
  const overlayPaddingBottom = 20;
  const rightActionsMarginTop = 100;
  const actionButtonMarginBottom = 24;
  const actionIconSize = 48;
  const actionIconRadius = 24;
  const actionTextSize = 12;
  const avatarSize = 40;
  const avatarRadius = 20;
  const avatarTextSize = 16;
  const followIconSize = 20;
  const followIconRadius = 10;
  const creatorNameSize = 15;
  const dishNameSize = 15;
  const dishNameLineHeight = 20;
  
  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;
    player.muted = false;
    player.volume = 1.0;
  });

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);
  
  return (
    <View style={styles.videoContainer}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      
      {/* Video Overlay - Exact TikTok Style */}
      <View style={styles.overlay}>
        {/* Right Side Actions - Exact TikTok Layout */}
        <View style={styles.rightActions}>
          {/* Profile Avatar with Plus Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onFollow}
            activeOpacity={0.7}
          >
            <View style={styles.profileContainer}>
              <View style={styles.creatorAvatar}>
                <Text style={styles.creatorAvatarText}>
                  {item.restaurantName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.followIconButton}>
                <Ionicons name="add" size={12} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onLike}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons
                name={item.isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={item.isLiked ? '#FF3040' : '#FFFFFF'}
              />
            </View>
            <Text style={styles.actionText}>
              {formatNumber(item.likes)}
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onComment}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="chatbubble-outline" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>
              {formatNumber(item.comments)}
            </Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onShare}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="share-outline" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>
              {formatNumber(item.shares)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info - Exact TikTok Style */}
        <View style={styles.bottomInfo}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.creatorName}>
              @{item.creator}
            </Text>
            <Text style={styles.dishName} numberOfLines={2}>
              {item.dishName}
            </Text>
            {item.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color="#FFFFFF" />
                <Text style={styles.location}>
                  {item.location}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Double Tap Area for Like */}
      <TouchableOpacity
        style={styles.doubleTapArea}
        activeOpacity={1}
        onPress={onDoubleTap}
      />

      {/* Heart Animation */}
      {showHeart && <HeartAnimation visible={showHeart} onComplete={onHeartComplete} />}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'relative',
    backgroundColor: '#000000',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 20,
  },
  rightActions: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 60,
    width: 56,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
    textAlign: 'center',
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  restaurantInfo: {
    flex: 1,
    maxWidth: SCREEN_WIDTH - 100,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E23744',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  creatorAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  followIconButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  creatorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dishName: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  doubleTapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});






