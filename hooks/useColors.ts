import useColorScheme from './useColorScheme'
import Colors from '../constants/Colors';

export default function useColors() {
  const colorScheme = useColorScheme()
  return Colors[colorScheme]
}
