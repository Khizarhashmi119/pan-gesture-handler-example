import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SIZE = 100;
const RADIUS = 180;

export default function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX + startX.value;
      translateY.value = event.translationY + startY.value;
    })
    .onEnd(() => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      if (distance < RADIUS) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        startX.value = 0;
        startY.value = 0;
      } else {
        startX.value = translateX.value;
        startY.value = translateY.value;
      }
    });

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.circle}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.box, boxAnimatedStyles]} />
        </GestureDetector>
      </View>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  circle: {
    alignItems: "center",
    borderColor: "#6363fc",
    borderRadius: RADIUS,
    borderStyle: "solid",
    borderWidth: 4,
    justifyContent: "center",
    width: 2 * RADIUS,
    height: 2 * RADIUS,
  },
  box: {
    backgroundColor: "#6363fc",
    borderRadius: SIZE / 4,
    height: SIZE,
    width: SIZE,
  },
});
