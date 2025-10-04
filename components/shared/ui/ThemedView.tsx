// components/shared/ui/ThemedView.tsx
import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
    backgroundColor?: string;
};

export function ThemedView({
                               style,
                               backgroundColor,
                               ...otherProps
                           }: ThemedViewProps) {
    const bgColor = backgroundColor || Colors.background.main;

    return <View style={[{ backgroundColor: bgColor }, style]} {...otherProps} />;
}