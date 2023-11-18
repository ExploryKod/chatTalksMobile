import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface MenuContainerProps {
  children: ReactNode;
  styles: any;
}

export default function MenuOption({ children, ...props }: MenuContainerProps) {
  return (
    <View style={props.styles}>
      {children}
    </View>
  )
}