
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState("100");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const savedCount = await AsyncStorage.getItem("salavat-count");
        const savedGoal = await AsyncStorage.getItem("salavat-goal");

        if (savedCount !== null) {
          const value = Number(savedCount);
          if (Number.isSafeInteger(value) && value >= 0) {
            setCount(value);
          }
        }

        if (savedGoal !== null) {
          setGoal(savedGoal);
        }
      } catch (error) {
        console.log("Load error:", error);
      } finally {
        setReady(true);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!ready) return;

    AsyncStorage.multiSet([
      ["salavat-count", String(count)],
      ["salavat-goal", goal],
    ]).catch((error) => console.log("Save error:", error));
  }, [count, goal, ready]);

  const target = Math.max(1, Number(goal) || 100);
  const progress = Math.min(count / target, 1);

  function resetCount() {
    Alert.alert(
      "شروع مجدد",
      "می‌خواهی شمارنده را صفر کنی؟",
      [
        { text: "لغو", style: "cancel" },
        {
          text: "صفر کن",
          style: "destructive",
          onPress: () => setCount(0),
        },
      ]
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#102820" />

      <Text style={styles.moon}>☾</Text>
      <Text style={styles.title}>صلوات‌شمار</Text>
      <Text style={styles.subtitle}>
        اللهم صل علی محمد و آل محمد
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>تعداد صلوات‌های شما</Text>
        <Text style={styles.count}>{count.toLocaleString("fa-IR")}</Text>
        <Text style={styles.goalText}>
          هدف: {target.toLocaleString("fa-IR")} صلوات
        </Text>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.percent}>
          {Math.round(progress * 100).toLocaleString("fa-IR")}٪ تکمیل شده
        </Text>

        {count >= target && (
          <Text style={styles.success}>
            🌟 به هدف خود رسیدی!
          </Text>
        )}
      </View>

      <Pressable
        onPress={() => setCount((c) => c + 1)}
        style={({ pressed }) => [
          styles.mainButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.plus}>＋</Text>
        <Text style={styles.mainButtonText}>صلوات فرستادم</Text>
      </Pressable>

      <View style={styles.buttonsRow}>
        <Pressable
          onPress={() => setCount((c) => Math.max(0, c - 1))}
          style={styles.smallButton}
        >
          <Text style={styles.smallButtonText}>− یک عدد</Text>
        </Pressable>

        <Pressable onPress={resetCount} style={styles.resetButton}>
          <Text style={styles.smallButtonText}>شروع مجدد</Text>
        </Pressable>
      </View>

      <View style={styles.goalCard}>
        <Text style={styles.goalHeading}>🎯 تنظیم هدف روزانه</Text>
        <TextInput
          value={goal}
          onChangeText={(value) =>
            setGoal(value.replace(/[^0-9]/g, "").slice(0, 7))
          }
          keyboardType="number-pad"
          placeholder="مثلاً 100"
          placeholderTextColor="#9CB0A4"
          style={styles.input}
          maxLength={7}
        />
        <Text style={styles.hint}>
          هدف دلخواهت را به عدد وارد کن.
        </Text>
      </View>

      <Text style={styles.footer}>با آرامش و یاد خدا 🌿</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#102820",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 35,
  },
  moon: {
    fontSize: 36,
    color: "#E8D5A5",
    marginBottom: 4,
  },
  title: {
    color: "#E8D5A5",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 28,
  },
  card: {
    width: "100%",
    backgroundColor: "#1C3B30",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#365B48",
  },
  label: {
    color: "#D4E2D8",
    fontSize: 16,
  },
  count: {
    color: "#E8D5A5",
    fontSize: 68,
    fontWeight: "bold",
    marginVertical: 8,
  },
  goalText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 20,
  },
  progressBackground: {
    width: "100%",
    height: 9,
    backgroundColor: "#345448",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#E8D5A5",
    borderRadius: 10,
  },
  percent: {
    color: "#D4E2D8",
    marginTop: 12,
    fontSize: 14,
  },
  success: {
    color: "#E8D5A5",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 16,
  },
  mainButton: {
    width: "100%",
    backgroundColor: "#D5B76A",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },
  plus: {
    color: "#102820",
    fontSize: 30,
    fontWeight: "bold",
  },
  mainButtonText: {
    color: "#102820",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 3,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  buttonsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginBottom: 22,
  },
  smallButton: {
    flex: 1,
    backgroundColor: "#1C3B30",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#75483D",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  smallButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  goalCard: {
    width: "100%",
    backgroundColor: "#1C3B30",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },
  goalHeading: {
    color: "#E8D5A5",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    backgroundColor: "#102820",
    color: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#476A57",
  },
  hint: {
    color: "#A9BDB0",
    fontSize: 13,
    marginTop: 10,
  },
  footer: {
    color: "#A9BDB0",
    marginTop: 26,
    fontSize: 14,
  },
});
