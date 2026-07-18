// Re-export the react-native-web implementations; gesture-handler's versions
// are drop-in wrappers around these on native.
export {
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
} from "react-native";

export { View as GestureHandlerRootView } from "react-native";
