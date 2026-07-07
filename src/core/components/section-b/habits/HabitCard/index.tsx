import React, {useEffect, useMemo, useState} from "react";
import {Platform, StyleSheet, View} from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number | string): number =>
  isWeb ? +(Number(p) * 3.8).toFixed(1) : _wp(p);
const hp = (p: number | string): number =>
  isWeb ? +(Number(p) * 3.8).toFixed(1) : _hp(p);

import {
  Banner,
  HabitHeaderSection,
  HabitLinkCard,
  HabitSubHeader,
} from "@/core/components/section-b";
import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";
import {IUser} from "@/core/models/section-a";
import {HabitComponent, Unit} from "@/core/models/section-b";
import {fetchUserByUserId} from "@/core/services/section-a/user";
import {fetchUnitsByDocumentId} from "@/core/services/section-b/section-b-0/units";
import {resolveImageSource} from "@/core/utils";
import {withOpacity} from "@/core/utils/utilities/color";

type Props = {
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  onCopyPress?: (id: string, parentId: string, dataType: string) => void;
  showHabitBanner?: boolean;
  habit: HabitComponent;
  defaultExpanded?: boolean;
  onOpenItem?: (link: any) => void;
  username?: string;
  mustReloadUser?: boolean;
  costSymbol?: string;
  hideCalendar?: boolean;
  canEdit?: boolean;
  selectedMarketActionId?: number;
  marketOwnerId?: string;
  showHabitLinkNav?: boolean;
  showExpandedButton?: boolean;
  canGoToSwapScreen?: boolean;
  showBottomUpSheetItemList?: boolean;
  onScoreComplete?: () => void;
  canAIScore?: boolean;
  ScreenOrigin?: string; // for analytics, e.g. "HabitCard"
};

const HabitCard: React.FC<Props> = ({
  showCopyButton = false,
  showCopyButtonText = "Copy",
  onCopyPress = (id?: string, parentId?: string, dataType?: string) =>
    console.log("Copy pressed"),
  habit,
  defaultExpanded = false,
  onOpenItem,
  showHabitBanner = false,
  username,
  mustReloadUser = false,
  costSymbol = "",
  hideCalendar = false,
  canEdit = false,
  selectedMarketActionId = 0,
  marketOwnerId,
  showHabitLinkNav = true,
  showExpandedButton = false,
  canGoToSwapScreen = false,
  showBottomUpSheetItemList = false,
  onScoreComplete,
  canAIScore = false,
  ScreenOrigin = "UNKNOWN",
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [costUnit, setCostUnit] = React.useState<Unit | undefined>(undefined);
  const [finalCostSymbol, setFinalCostSymbol] = useState(costSymbol);
  const [liveUser, setLiveUser] = useState<IUser>(undefined);

  const iconSource = useMemo(
    () => resolveImageSource(habit?.icon, Images.cup),
    [habit?.icon],
  );

  const scoreColor = habit?.scoreComponent?.scoreInfo?.color?.toLowerCase?.();
  const iconColor = habit?.iconColor ?? 'rgba(128, 128, 128, 0.5)'; // default icon background color (can be customized via habit data)

  const [liveUsername, setLiveUsername] = useState(username || "");

  // if(habit.id === '29b1bf5c-5b07-4feb-9df0-a727774e8087') {
  //   console.log("HabitCard --> Habit ID matched for logging.");
  //   console.log("HabitCard --> Rendering habit:", habit);
  // }

  React.useEffect(() => {
    const loadUser = async () => {
      if (mustReloadUser) {
        // console.log("Reloading user for stack:", stack);
        const userId =
          selectedMarketActionId === 4
            ? marketOwnerId || habit?.userId
            : habit?.userId;

        const user = await fetchUserByUserId(userId ?? "");
        // console.log("Fetched user:", user);
        setLiveUser(user);
        if (user?.username) {
          setLiveUsername(user.username);
        } else [setLiveUsername("Unknown User")];
      }
    };

    loadUser();
  }, [mustReloadUser, habit?.userId]);

  useEffect(() => {
    const fetchUnit = async () => {
      //console.log("HabitCard --> Fetching unit for habit:", habit);
      const unit = habit?.unit;
      //console.log("Fetching unit for unit ID:", unit);
      const fetchedUnits = await fetchUnitsByDocumentId(unit || "");
      //console.log("HabitCard --> Fetched units:", fetchedUnits);

      if (fetchedUnits && fetchedUnits.length > 0) {
        setCostUnit(fetchedUnits[0]);
        setFinalCostSymbol(fetchedUnits[0]?.symbol || "");
      }
    };

    if (costSymbol === "") {
      fetchUnit();
    }
  }, [habit?.unit, costSymbol]);

  return (
    <View style={[s.card, { borderTopColor: habit?.iconColor ?? Colors.blue }]}>
      {showHabitBanner && (
        <Banner
          dataType="habit"
          bannerImage={habit?.bannerImage}
          showCopyButton={showCopyButton}
          showCopyButtonText={showCopyButtonText}
          onCopyPress={onCopyPress}
          username={mustReloadUser ? liveUsername : username}
          data={habit}
          userProfileImage={liveUser ? liveUser?.photo || "" : ""}
          user={liveUser}
          ScreenOrigin={ScreenOrigin}
        />
      )}
      <HabitHeaderSection
        name={habit?.name}
        iconSource={iconSource}
        starTint={scoreColor ?? Colors.inuptborder}
        iconColor={withOpacity(iconColor, 0.2)}
        likesCount={habit?.habitLikes?.length ?? 0}
        expanded={expanded}
        onToggleExpand={() => setExpanded((v) => !v)}
        cost={habit?.scoreComponent?.cost ?? 0}
        focus={habit?.focus}
        priority={habit?.priority}
        status={
          habit?.status?.trim().toLowerCase()
            ? habit?.status?.trim().toLowerCase()
            : "play"
        }
        interest={habit?.interest}
        accentColor={scoreColor}
        costSymbol={finalCostSymbol}
        habit={habit}
        hideCalendar={hideCalendar}
        canEdit={canEdit}
        canGoToSwapScreen={canGoToSwapScreen}
        onScoreComplete={onScoreComplete}
      />

      {expanded && (
        <>
          <HabitSubHeader habit={habit} scoreColor={scoreColor} />
          {(habit?.habitLinkData ?? []).map((lk, idx) => (
            <HabitLinkCard
              key={lk.documentId ?? lk.id ?? idx}
              link={lk}
              onOpenItem={() => onOpenItem?.(lk)}
              costSymbol={finalCostSymbol}
              hideCalendar={hideCalendar}
              showHabitLinkNav={showHabitLinkNav}
              showExpandedButton={showExpandedButton}
              canGoToSwapScreen={canGoToSwapScreen}
              showBottomUpSheetItemList={showBottomUpSheetItemList}
              onScoreComplete={onScoreComplete}
              canAIScore={canAIScore}
              ScreenOrigin={ScreenOrigin}
            />
          ))}
        </>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: "#212426",
    borderTopWidth: 2.5,
    borderRadius: isWeb ? 10 : wp("3%"),
    paddingHorizontal: isWeb ? 6 : wp("1%"),
    paddingBottom: isWeb ? 8 : hp("1%"),
    marginTop: isWeb ? 12 : hp("3%"),
  },
  hero: {
    width: wp(84),
    height: hp(17.4),
    padding: wp(2),
    justifyContent: "flex-end",
  },
  avatar: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(5),
    marginRight: wp(2),
  },
});

export default HabitCard;
