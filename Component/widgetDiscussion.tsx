import React, { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';

interface DiscussionContainerProps {
  children: ReactNode;
  onPress?: () => void; // Ajoutez la prop onPress
  styles: any;
}

export default function widgetDiscussion({ children, onPress, ...props }: DiscussionContainerProps) {
  const discussionContent = (
    <View style={props.styles}>
      {children}
    </View>
  );

  if (onPress) {
    // Si la prop onPress est fournie, enveloppez la discussion dans TouchableOpacity
    return (
      <TouchableOpacity onPress={onPress}>
        {discussionContent}
      </TouchableOpacity>
    );
  }

  return discussionContent;
}
