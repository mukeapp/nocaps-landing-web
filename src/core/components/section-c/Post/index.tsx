import {NocapPost} from '@/core/models/section-c';
import React from 'react';
import { View } from 'react-native';
import PostItem from '../PostItem';

interface PostProps {
  posts: NocapPost[];
  currentUserId: string;
}

const Post = ({ posts, currentUserId }: PostProps) => {
  return (
    <View>
      {posts.map((post) => (
        <PostItem key={post.documentId} post={post} currentUserId={currentUserId} />
      ))}
    </View>
  );
};

export default Post;