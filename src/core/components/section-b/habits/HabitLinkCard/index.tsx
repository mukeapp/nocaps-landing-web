import {
  HabitLinkItemPreview,
  HabitLinkItemRow,
  HabitLinkItemsList,
} from "@/core/components/section-b";
import {Colors} from "@/core/constants/Colors";
import {IUser} from "@/core/models/section-a";
import {
  HabitLinkComponent,
  HabitLinkItemComponent,
  RouterData,
  Unit,
} from "@/core/models/section-b";
import {fetchHabitComponentByHabitId} from "@/core/services/section-b";
import {fetchUnitsByDocumentId} from "@/core/services/section-b/section-b-0/units";
import {resolveImageSource, truncateString} from "@/core/utils";
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {Platform, StyleSheet, View} from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);

type Props = {
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  showCopyButtonForItem?: boolean;
  showCopyButtonTextForItem?: string;
  onCopyPress?: (id: string, parentId: string, dataType: string) => void;
  showHabitLinkBanner?: boolean;
  link: HabitLinkComponent;
  onOpenItem?: (link: HabitLinkComponent) => void;
  costSymbol?: string;
  hideCalendar?: boolean;
  showHabitLinkNav?: boolean;
  defaultExpanded?: boolean;
  showExpandedButton?: boolean;
  isHabitCalendar?: boolean;
  selectedMarketActionId?: number;
  marketOwnerId?: string;
  mustReloadUser?: boolean;
  canGoToSwapScreen?: boolean;
  showBottomUpSheetItemList?: boolean;
  onScoreComplete?: () => void;
  canAIScore?: boolean;
  ScreenOrigin?: string; // for analytics, e.g. "HabitLinkCard"
};

const HabitLinkCard: React.FC<Props> = ({
  showCopyButton = false,
  showCopyButtonText = "Copy",
  showCopyButtonForItem = false,
  showCopyButtonTextForItem = "Copy",
  onCopyPress = (id: string, parentId: string, dataType: string) =>
    console.log("Copy pressed"),
  link,
  onOpenItem,
  showHabitLinkBanner = false,
  costSymbol = "",
  hideCalendar = false,
  showHabitLinkNav = true,
  defaultExpanded = false,
  showExpandedButton = false,
  isHabitCalendar = false,
  selectedMarketActionId = 0,
  marketOwnerId = "",
  mustReloadUser = false,
  canGoToSwapScreen = false,
  showBottomUpSheetItemList = false,
  onScoreComplete,
  canAIScore = false,
  ScreenOrigin = "UNKNOWN",
}) => {
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [costUnit, setCostUnit] = useState<Unit | undefined>(undefined);
  const [finalCostSymbol, setFinalCostSymbol] = useState(costSymbol);

  const items = link?.habitLinkItemComponentsData ?? [];
  const progress = link?.scoreComponent?.score ?? 0;
  const color = link?.scoreComponent?.scoreInfo?.color?.toLowerCase();
  const cost = link?.scoreComponent?.cost || 0;

  // sheets / info
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [infoItem, setInfoItem] = useState<HabitLinkItemComponent>({});
  const [liveUser, setLiveUser] = useState<IUser>(null);
  const [liveUsername, setLiveUsername] = useState("");

  // console.log("HabitLinkCard --> Rendering link:", link);

  // if(link.id === '65096bc3-f947-4900-9f26-90274cada4f7') {
  //   // console.log("HabitLinkCard --> Habit ID matched for logging.");
  //   // console.log("HabitLinkCard --> Rendering habit:", link);

  //   // console.log("HabitLinkCard --> Items:", items);
  //   console.log("items.length:", items.length);
  // }

  // React.useEffect(() => {
  //     const loadUser = async () => {
  //       if (mustReloadUser) {
  //         // console.log("Reloading user for stack:", stack);
  //         const userId =
  //             selectedMarketActionId === 4
  //             ? marketOwnerId
  //             : link?.userId;

  //         const user = await fetchUserByUserId(userId ?? "");
  //         // console.log("Fetched user:", user);
  //         setLiveUser(user);
  //         if (user?.username) {
  //           setLiveUsername(user.username);
  //         } else [setLiveUsername("Unknown User")];
  //       }
  //     };

  //     loadUser();
  //   }, [mustReloadUser, link?.userId, selectedMarketActionId, marketOwnerId]);

  const goToHabitLinkCalendar = () => {
    const routerData: RouterData = {
      destinationScreenTitle: "HabitLink Calendar",
      habitLink: link,
    };
    navigation.navigate("habit-calendar", {
      OriginScreen: "habit-link-card",
      routerData,
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUnit = async () => {
      try {
        const habit = await fetchHabitComponentByHabitId(link.habitId || "");
        //console.log("HabitLinkCard --> Fetched habit:", habit);

        const unit = habit?.unit;
        //console.log("HabitLinkCard --> Fetching unit for unit ID:", unit);

        const fetchedUnits = await fetchUnitsByDocumentId(unit || "");
        //console.log("HabitLinkCard --> Fetched units:", fetchedUnits);

        if (isMounted && fetchedUnits && fetchedUnits.length > 0) {
          setCostUnit(fetchedUnits[0]);
          setFinalCostSymbol(fetchedUnits[0]?.symbol || "");
        }
      } catch (error) {
        console.error("HabitLinkCard --> Error fetching unit:", error);
      }
    };

    if (costSymbol === "" && link?.habitId) {
      fetchUnit();
    } else if (costSymbol !== "") {
      setFinalCostSymbol(costSymbol);
    }

    return () => {
      isMounted = false;
    };
  }, [link?.habitId, costSymbol]);

  if (!items.length || items.length === 0) {
    return (
      <HabitLinkItemRow
        showCopyButton={showCopyButton}
        showCopyButtonText={showCopyButtonText}
        onCopyPress={onCopyPress}
        habitLink={link}
        showHabitLinkBanner={showHabitLinkBanner}
        name={truncateString(link?.name ?? "", 30) ?? "Item"}
        cost={0}
        progress={0}
        progressColor={Colors.inputback}
        iconSource={resolveImageSource(link?.icon)}
        onOpen={() => onOpenItem?.(link)}
        costSymbol={finalCostSymbol}
        hideCalendar={hideCalendar}
        showHabitLinkNav={showHabitLinkNav}
        expanded={expanded}
        setExpanded={setExpanded}
        showExpandedButton={showExpandedButton}
        isHabitCalendar={isHabitCalendar}
        selectedMarketActionId={selectedMarketActionId}
        marketOwnerId={marketOwnerId}
        canGoToSwapScreen={canGoToSwapScreen}
        onScoreComplete={onScoreComplete}
        canAIScore={canAIScore}
        ScreenOrigin={ScreenOrigin}
      />
    );
  }

  const onInfoItem = (item: HabitLinkItemComponent) => {
    setInfoItem(item);
    setShowInfoSheet(true);
  };

  const onDismissSheet = (action?: "shet" | "deleteit") => {
    setShowDeleteSheet(false);
    if (action === "shet") {
      setShowInfoSheet(false);
    }
  };

  return (
    <View>
      <HabitLinkItemRow
        showCopyButton={showCopyButton}
        showCopyButtonText={showCopyButtonText}
        onCopyPress={onCopyPress}
        habitLink={link}
        showHabitLinkBanner={showHabitLinkBanner}
        key={link.documentId ?? link.id}
        name={truncateString(link?.name ?? "", 30) ?? "Item"}
        cost={cost ?? 0}
        progress={progress}
        progressColor={color ?? Colors.inputback}
        iconSource={resolveImageSource(link?.icon)}
        onOpen={() => onOpenItem?.(link)}
        costSymbol={finalCostSymbol}
        hideCalendar={hideCalendar}
        goToHabitLinkCalendar={goToHabitLinkCalendar}
        showHabitLinkNav={showHabitLinkNav}
        expanded={expanded}
        setExpanded={setExpanded}
        showExpandedButton={showExpandedButton}
        isHabitCalendar={isHabitCalendar}
        selectedMarketActionId={selectedMarketActionId}
        marketOwnerId={marketOwnerId}
        canGoToSwapScreen={canGoToSwapScreen}
        showBottomUpSheetItemList={showBottomUpSheetItemList}
        onScoreComplete={onScoreComplete}
        canAIScore={canAIScore}
        ScreenOrigin={ScreenOrigin}
      />
      {showExpandedButton && expanded && (
        <HabitLinkItemsList
          costSymbol={finalCostSymbol}
          canEdit={false}
          items={items}
          color={link.iconColor}
          onEdit={(item) => console.log("Edit item")}
          onInfo={(item) => onInfoItem(item)}
          onDelete={(item) => console.log("Delete item")}
          canShowCheckbox={false}
          showCopyButton={showCopyButtonForItem}
          showCopyButtonText={showCopyButtonTextForItem}
          onCopyPress={onCopyPress}
          dataType="habit-link-item"
        />
      )}

      {showExpandedButton && expanded && (
        <HabitLinkItemPreview
          canEdit={false}
          rnsheet={showInfoSheet}
          shotlist={showDeleteSheet}
          closefun={onDismissSheet}
          dataitem={infoItem}
        />
      )}
    </View>
  );
};

export default HabitLinkCard;

const styles = StyleSheet.create({
  stackCard: {
    width: wp(90),
    minHeight: hp(10),
    marginRight: wp(3),
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },
});
