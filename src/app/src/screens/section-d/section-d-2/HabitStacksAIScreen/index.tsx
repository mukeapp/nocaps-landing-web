import {HabitStackCard} from "@/core/components/section-b";
import CountdownLoader from "@/core/components/section-b/loader/CountdownLoader";
import {Timeout, toSeconds} from "@/core/utils/utilities/timeout";
import {SCORE_TIERS, getScoreTier} from "@/core/components/section-d";
import {Colors} from "@/core/constants/Colors";
import useHabitStacksAIForm from "@/core/hooks/useHabitStacksAIForm";
import {HabitStackComponent} from "@/core/models/section-b";
import {Ionicons} from "@expo/vector-icons";
import React, {useCallback} from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Toast from "react-native-root-toast";

interface HabitStacksAIScreenProps {
  navigation: any;
  route: any;
}

const getStackScore = (stack: HabitStackComponent): number => {
  const raw = stack.scoreComponent?.score ?? 0;
  const pct = raw > 1 ? raw : Math.round(raw * 100);
  return pct;
};

const HabitStacksAIScreen: React.FC<HabitStacksAIScreenProps> = ({
  navigation,
  route,
}) => {
  const form = useHabitStacksAIForm({ navigation, route });

  const handleAdd = useCallback(
    async (stack: HabitStackComponent) => {
      const success = await form.processGen(stack);
      if (success) {
        Toast.show(`✓ ${stack.name ?? "Habit Stack"} added successfully!`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          backgroundColor: "rgba(34,197,94,0.9)",
          textColor: "#fff",
          shadow: false,
          animation: true,
          hideOnPress: true,
        });
      }
    },
    [form],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f18" />

      <CountdownLoader
        visible={form.loading}
        text="AI is generating Habit Stacks..."
        totalSeconds={toSeconds(Timeout.generateHabitStacks)}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={form.goBack}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIconText}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerSub}>Add Habit Stack</Text>
          <Text style={styles.headerTitle}>Habit Stack AI</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {!form.loading && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>AI GENERATED</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.legend}>
            {SCORE_TIERS.filter((t) => t.code !== "UNKNOWN").map((tier) => (
              <View key={tier.code} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: tier.hex }]}
                />
                <Text style={styles.legendText}>
                  {tier.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.stackList}>
            {form.generatedStacks.map((stack) => {
              const stackId = stack.documentId ?? stack.id;
              const isAdded =
                form.addedStack != null &&
                (form.addedStack.documentId === stackId ||
                  form.addedStack.id === stackId);
              const isLoading = form.processingStackId === stackId;
              const scorePct = getStackScore(stack);
              const tier = getScoreTier(scorePct);
              return (
                <View
                  key={stack.id ?? stack.documentId}
                  style={[
                    styles.stackCardWrapper,
                    {
                      borderColor: isAdded ? tier.hex : "rgba(59,130,246,0.3)",
                    },
                  ]}
                >
                  <HabitStackCard
                    stack={stack}
                    canEdit={false}
                    showBottomUpSheetItemList={true}
                    showExpandedButton={false}
                    showHabitLinkNav={false}
                    canGoToSwapScreen={false}
                    showCopyButton={true}
                    showCopyButtonText={
                      isLoading
                        ? "...processing"
                        : isAdded
                          ? "Added ✓"
                          : "＋ Add Stack"
                    }
                    onCopyPress={
                      !!form.processingStackId
                        ? undefined
                        : () => handleAdd(stack)
                    }
                    hideCalendar={true}
                    ScreenOrigin="HabitStacksAIScreen"
                  />
                </View>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HabitStacksAIScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0f0f18" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(26, 203, 85, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: { color: "#f1f5f9", fontSize: 18 },
  headerSub: {
    color: "#6b7280",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerTitle: { color: "#f1f5f9", fontSize: 17, fontWeight: "800" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  dividerLabel: { color: "#6b7280", fontSize: 10, letterSpacing: 2 },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: "#6b7280", fontSize: 9, letterSpacing: 0.5 },
  stackList: { paddingHorizontal: 16 },
  stackCardWrapper: {
    borderWidth: 1.5,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
});
