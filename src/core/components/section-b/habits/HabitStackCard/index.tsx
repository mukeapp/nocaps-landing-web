import {
  Banner,
  HabitCard,
  HabitFooterRow,
  HabitStackHeader,
  HabitStackSummary,
} from "@/core/components/section-b";
import {Colors} from "@/core/constants/Colors";
import {HabitStackComponent, Unit} from "@/core/models/section-b";
import {fetchUserByUserId} from "@/core/services/section-a/user";
import {withOpacity} from "@/core/utils/utilities/color";
import {fetchUnitsByDocumentId} from "@/core/services/section-b/section-b-0/units";
import React, {useEffect, useState} from "react";
import {Platform, StyleSheet, View} from "react-native";

type Props = {
  hideCalendar?: boolean;
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  onCopyPress?: (id: string, parentId: string, dataType: string) => void;
  mustReloadUser?: boolean;
  stack?: HabitStackComponent;
  username?: string;
  canEdit?: boolean;
  onEdit?: (stack: HabitStackComponent) => void;
  onDelete?: (stack: HabitStackComponent) => void;
  onOpenLinkItem?: (link: any) => void;
  selectedMarketActionId?: number;
  showHabitLinkNav?: boolean;
  showExpandedButton?: boolean;
  canGoToSwapScreen?: boolean;
  showBottomUpSheetItemList?: boolean;
  onScoreComplete?: () => void;
  canAIScore?: boolean;
  ScreenOrigin?: string; // for analytics, e.g. "HabitStackCard"
  hideLikeIcon?: boolean;
  hideScore?: boolean;
  hideChevron?: boolean;
  bannerImageShowIconGoToHabitAndFriends: boolean; // If true, clicking the banner image will navigate to the habit and friends screen
  hideHabitStackCost?: boolean; // If true, the cost of the habit stack will be hidden
  friendshipStatus?: boolean; // true if the user is friends with the habit stack owner, false otherwise
};

const HabitStackCard: React.FC<Props> = ({
  showCopyButton = false,
  showCopyButtonText = "Copy Item",
  onCopyPress = (id: string, parentId: string, dataType: string) =>
    console.log("Copy pressed"),
  mustReloadUser = false,
  stack,
  username,
  canEdit = false,
  onEdit,
  onDelete,
  onOpenLinkItem,
  hideCalendar = false,
  selectedMarketActionId = 0,
  showHabitLinkNav = true,
  showExpandedButton = false,
  canGoToSwapScreen = false,
  showBottomUpSheetItemList = false,
  onScoreComplete,
  canAIScore = false,
  ScreenOrigin = "UNKNOWN",
  hideLikeIcon = false,
  hideScore = false,
  hideChevron = false,
  bannerImageShowIconGoToHabitAndFriends = false,
  hideHabitStackCost = false,
  friendshipStatus = true,
}) => {
  const [costUnit, setCostUnit] = React.useState<Unit | undefined>(undefined);
  const [expanded, setExpanded] = useState(false);

  const [liveUsername, setLiveUsername] = useState(username || ""); // State to hold the username
  const [liveUserProfileImage, setLiveUserProfileImage] = useState(""); // State to hold the profile image
  const [user, setUser] = useState<any>(null);
  const score = stack?.scoreComponent?.score ?? 0;

  const color =
    stack?.scoreComponent?.scoreInfo?.rgb ??
    stack?.iconColor ??
    Colors.inuptborder;

  const progressColor =
    stack?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
    Colors.inputback;

  const stackBorderColor = stack?.iconColor
    ? withOpacity(stack.iconColor, 0.5)
    : 'rgba(0, 0, 0, 0.5)';

  React.useEffect(() => {
    const loadUser = async () => {
      if (mustReloadUser) {
        // console.log("Reloading user for stack:", stack);
        const userId =
          selectedMarketActionId === 4
            ? stack?.marketOwnerId || stack?.userId // 👈 ADD FALLBACK
            : stack?.userId;
        const response = userId ? await fetchUserByUserId(userId) : null;
        setUser(response);
        //console.log("Fetched response test-01-07-26 000:", response);
        //console.log("Fetched user test-01-07-26 001:", user);
        if (response?.username) {
          setLiveUsername(response.username);
        } else [setLiveUsername("Unknown User")];
        if (response?.photo) {
          setLiveUserProfileImage(response.photo);
        }
      }
    };

    loadUser();
  }, [
    mustReloadUser,
    stack?.userId,
    selectedMarketActionId,
    stack?.marketOwnerId,
  ]);

  useEffect(() => {
    const fetchUnit = async () => {
      const unit = stack?.unit;
      //console.log("Fetching unit for unit ID:", unit);
      const fetchedUnits = await fetchUnitsByDocumentId(unit || "");

      if (fetchedUnits && fetchedUnits.length > 0) {
        setCostUnit(fetchedUnits[0]);
      }
    };

    fetchUnit();
  }, [stack?.unit]);

  return (
    <View
      style={[
        s.wrapper,
        { borderColor: stackBorderColor, borderWidth: 1 },
        Platform.OS === "web" && { marginBottom: 0, height: "100%" },
      ]}
    >
      <Banner
        dataType="habit-stack"
        bannerImage={stack?.bannerImage}
        showCopyButton={showCopyButton}
        showCopyButtonText={showCopyButtonText}
        onCopyPress={onCopyPress}
        username={mustReloadUser ? liveUsername : username}
        data={stack}
        userProfileImage={mustReloadUser ? liveUserProfileImage : ""}
        user={user}
        bannerImageShowIconGoToHabitAndFriends={bannerImageShowIconGoToHabitAndFriends}
      />

      <HabitStackHeader
        icon={stack?.icon}
        color={color}
        iconColor={withOpacity(stackBorderColor, 0.2)}
        name={stack?.name}
        personsCount={stack?.personsCount ?? 0}
        expanded={expanded}
        canEdit={canEdit}
        setExpanded={setExpanded}
        onEdit={() => onEdit?.(stack)}
        onDelete={() => onDelete?.(stack)}
        cost={stack?.scoreComponent?.cost ?? 0}
        focus={stack?.focus}
        priority={stack?.priority}
        statusIcon={
          stack?.status?.trim().toLowerCase()
            ? stack?.status?.trim().toLowerCase()
            : "play"
        }
        costSymbol={costUnit?.symbol ?? ""}
        stack={stack}
        hideCalendar={hideCalendar}
        onScoreComplete={onScoreComplete}
        canAIScore={canAIScore}
        hideChevron={hideChevron}
        hideHabitStackCost={hideHabitStackCost}
        hideHabitStackCalendarOption={!friendshipStatus}
      />

      { friendshipStatus &&
       (
          <HabitStackSummary
          color={color}
          habits={stack?.habitData ?? []}
          score={score < 1 ? score * 100 : score}
          progressColor={progressColor}
          label={stack?.scoreComponent?.scoreInfo?.label ?? ""}
          costSymbol={costUnit?.symbol ?? ""}
          hideScore={hideScore}
        />
       )
      }

      {Platform.OS === "web" ? (
        <div
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
            opacity: expanded ? 1 : 0,
            transition:
              "grid-template-rows 300ms ease-out, opacity 300ms ease-out",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            {(stack?.habitData ?? []).map((h, i) => (
              <HabitCard
                key={h.documentId ?? h.id ?? i}
                habit={h}
                onOpenItem={onOpenLinkItem}
                costSymbol={costUnit?.symbol ?? ""}
                hideCalendar={hideCalendar}
                canEdit={canEdit}
                showExpandedButton={showExpandedButton}
                showHabitLinkNav={showHabitLinkNav}
                canGoToSwapScreen={canGoToSwapScreen}
                showBottomUpSheetItemList={showBottomUpSheetItemList}
                onScoreComplete={onScoreComplete}
                canAIScore={canAIScore}
                ScreenOrigin={ScreenOrigin}
              />
            ))}
          </div>
        </div>
      ) : (
        expanded &&
        (stack?.habitData ?? []).map((h, i) => (
          <HabitCard
            key={h.documentId ?? h.id ?? i}
            habit={h}
            onOpenItem={onOpenLinkItem}
            costSymbol={costUnit?.symbol ?? ""}
            hideCalendar={hideCalendar}
            canEdit={canEdit}
            showExpandedButton={showExpandedButton}
            showHabitLinkNav={showHabitLinkNav}
            canGoToSwapScreen={canGoToSwapScreen}
            showBottomUpSheetItemList={showBottomUpSheetItemList}
            onScoreComplete={onScoreComplete}
            canAIScore={canAIScore}
            ScreenOrigin={ScreenOrigin}
          />
        ))
      )}

      <HabitFooterRow
        canEdit={canEdit}
        likesCount={
          Array.isArray(stack?.habitStackLikes)
            ? stack.habitStackLikes.length
            : (stack as any)?.habitStackLikes
        }
        onEdit={() => onEdit?.(stack)}
        hideLikeIcon={hideLikeIcon}
        habitStack={stack}
      />
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: Colors.content_back,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
});

export default HabitStackCard;
