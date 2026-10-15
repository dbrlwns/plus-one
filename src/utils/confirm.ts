import { Alert, Platform } from 'react-native';

/** 웹에서는 Alert 버튼이 동작하지 않으므로 window.confirm으로 대체한다. */
export function confirmAction(title: string, message: string, onConfirm: () => void): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: '취소', style: 'cancel' },
    { text: '확인', style: 'destructive', onPress: onConfirm },
  ]);
}

export function notify(title: string, message: string): void {
  if (Platform.OS === 'web') window.alert(`${title}\n${message}`);
  else Alert.alert(title, message);
}
