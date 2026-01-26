import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { VideoItemComponent, VideoItem } from './VideoItemComponent';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoFeedProps {
  videos: VideoItem[];
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
  onFollow?: (creatorId: string) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  onLike,
  onComment,
  onShare,
  onFollow,
}) => {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [showHeart, setShowHeart] = useState<{ [key: string]: boolean }>({});
  const [lastTap, setLastTap] = useState<{ time: number; videoId: string } | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
      setPlayingIndex(newIndex);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleLike = (videoId: string) => {
    onLike?.(videoId);
  };

  const handleDoubleTap = (videoId: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap && lastTap.videoId === videoId && now - lastTap.time < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleLike(videoId);
      setShowHeart({ ...showHeart, [videoId]: true });
      setLastTap(null);
    } else {
      setLastTap({ time: now, videoId });
    }
  };

  const handleHeartComplete = (videoId: string) => {
    setShowHeart({ ...showHeart, [videoId]: false });
  };

  const renderVideoItem = ({ item, index }: { item: VideoItem; index: number }) => {
    return (
      <VideoItemComponent
        item={item}
        index={index}
        isPlaying={index === playingIndex}
        onLike={() => handleLike(item.id)}
        onComment={() => onComment?.(item.id)}
        onShare={() => onShare?.(item.id)}
        onFollow={() => onFollow?.(item.creator)}
        onDoubleTap={() => handleDoubleTap(item.id)}
        showHeart={showHeart[item.id] || false}
        onHeartComplete={() => handleHeartComplete(item.id)}
      />
    );
  };

  if (videos.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.emptyText, { color: colors.textLight }]}>
          No videos available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      renderItem={renderVideoItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      getItemLayout={(data, index) => ({
        length: SCREEN_HEIGHT,
        offset: SCREEN_HEIGHT * index,
        index,
      })}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ flex: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  rightActions: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 50,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 25,
  },
  actionText: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dishName: {
    fontSize: 16,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 5,
    opacity: 0.9,
  },
  followButton: {
    backgroundColor: '#E23744',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  doubleTapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
  },
});

