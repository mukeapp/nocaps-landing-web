import {Dropdown} from "react-native-element-dropdown";
import {
  makeSelectCompanyModels,
  selectVisibleCompanies,
} from "@/core/redux/ai-models-cost-multiplier";
import React from "react";
import {StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";

type Props = {
  selectedCompany: string;
  selectedModelId: string;
  onCompanyChange: (companyName: string) => void;
  onModelChange: (modelId: string) => void;
};

const AIModelSelector: React.FC<Props> = ({
  selectedCompany,
  selectedModelId,
  onCompanyChange,
  onModelChange,
}) => {
  const visibleCompanies = useSelector(selectVisibleCompanies);
  const companyModels = useSelector(makeSelectCompanyModels(selectedCompany));

  return (
    <View style={s.row}>
      <Dropdown
        style={s.dropdown}
        data={visibleCompanies.map(c => ({ label: c.name, value: c.name }))}
        labelField="label"
        valueField="value"
        value={selectedCompany}
        onChange={item => onCompanyChange(item.value)}
        selectedTextStyle={{ color: "#E0E0E0", fontSize: 12 }}
        containerStyle={{ backgroundColor: "#1e1b4b" }}
        activeColor="#16a34a"
        itemTextStyle={{ color: "#E0E0E0" }}
      />
      <Dropdown
        style={s.dropdown}
        data={companyModels.map(m => ({ label: m.name, value: m.id }))}
        labelField="label"
        valueField="value"
        value={selectedModelId}
        onChange={item => onModelChange(item.value)}
        selectedTextStyle={{ color: "#E0E0E0", fontSize: 12 }}
        containerStyle={{ backgroundColor: "#1e1b4b" }}
        activeColor="#16a34a"
        itemTextStyle={{ color: "#E0E0E0" }}
      />
    </View>
  );
};

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    width: "100%",
  },
  dropdown: {
    flex: 1,
    backgroundColor: "#1e1b4b",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3730a3",
    paddingHorizontal: 10,
    height: 36,
  },
});

export default AIModelSelector;
