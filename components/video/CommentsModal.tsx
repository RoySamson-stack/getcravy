import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { VideoComment } from '../../services/videoAPI';

interface CommentsModalProps {
  visible: boolean;
  videoId: string;
  comments: VideoComment[];
  loading?: boolean;
  onClose: () => void;
  onSubmitComment: (text: string) => void;
  onLikeComment?: (commentId: string) => void;
}

// Helper to format timestamp
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  videoId,
  comments,
  loading = false,
  onClose,
  onSubmitComment,
  onLikeComment,
}) => {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(comments);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmitComment(commentText.trim());
      setCommentText('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    setLocalComments(localComments.map(comment =>
      comment.id === commentId
        ? { ...comment, likesCount: comment.likesCount + 1 }
        : comment
    ));
    onLikeComment?.(commentId);
  };

  const renderComment = ({ item }: { item: VideoComment }) => (
    <View style={[styles.commentItem, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.commentHeader}>
        <View style={styles.avatar}>
          <Text style={[styles.avatarText, { color: colors.white }]}>
            {item.user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.commentContent}>
          <Text style={[styles.commentUser, { color: colors.text }]}>{item.user.name}</Text>
          <Text style={[styles.commentText, { color: colors.text }]}>{item.content}</Text>
          <View style={styles.commentFooter}>
            <Text style={[styles.commentTime, { color: colors.textLight }]}>
              {formatTimestamp(item.createdAt)}
            </Text>
            <TouchableOpacity
              style={styles.commentLikeButton}
              onPress={() => handleLikeComment(item.id)}
            >
              <Ionicons
                name="heart-outline"
                size={16}
                color={colors.textLight}
              />
              <Text style={[styles.commentLikes, { color: colors.textLight }]}>
                {item.likesCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Comments ({localComments.length})
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={localComments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textLight }]}>
                    No comments yet. Be the first to comment!
                  </Text>
                </View>
              }
            />
          )}

          {/* Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textLighter}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: commentText.trim() ? colors.primary : colors.border }
              ]}
              onPress={handleSubmit}
              disabled={!commentText.trim()}
            >
              <Ionicons name="send" size={20} color={commentText.trim() ? colors.white : colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    padding: 15,
  },
  commentItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E23744',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTime: {
    fontSize: 12,
    marginRight: 15,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikes: {
    fontSize: 12,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});





