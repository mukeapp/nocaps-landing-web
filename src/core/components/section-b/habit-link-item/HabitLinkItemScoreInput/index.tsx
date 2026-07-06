import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "@/core/utils/responsive";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import {getScoreCode, getScoreColor} from "@/core/utils/utilities/score";

type Props = {
  score: string;
  onChangeScore: (v: string) => void;
};

const HabitLinkItemScoreInput: React.FC<Props> = ({ score, onChangeScore }) => {

  const handleScoreChange = (txt: string) => {
    // Only allow numbers from 0 to 100 (and empty string)
    const numericValue = parseInt(txt, 10);
    const regex = /^\d{0,3}$/;

    if (regex.test(txt)) {
      if (txt === "" || (numericValue >= 0 && numericValue <= 100)) {
        onChangeScore(txt);
      }
    }
  };

  // Memoize score calculation to avoid re-calculating on every render
  const scoreInfo = useMemo(() => {
    const scoreInt = parseInt(score, 10);
    // Convert percentage (0-100) to decimal score (0.0-1.0)
    const decimalScore = isNaN(scoreInt) || scoreInt < 0 ? 0 : scoreInt / 100;

    // Get the score code and color
    const result = getScoreCode(decimalScore);
    const color = getScoreColor(result.scoreCode);

    return {
      code: result.scoreCode,
      color: color
    };
  }, [score]);


  return (
    <View style={[styles.mt]}>
      <Text style={MainStyles.text14}>Item Score (Optional)</Text>
      <View style={[styles.inputRow, styles.inputWrap]}>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          value={score}
          onChangeText={handleScoreChange}
          placeholder="0"
          placeholderTextColor={"rgba(134, 134, 134, 1)"}
          keyboardType="numeric"
          maxLength={3} // Max length for "100"
        />
        <Text style={styles.percentText}>%</Text>

        {/* Score Code Display */}
        <View style={styles.codeContainer}>
          <View style={[styles.colorCircle, { backgroundColor: scoreInfo.color }]} />
          <Text style={styles.codeText}>{scoreInfo.code}</Text>
        </View>

      </View>
    </View>
  );
};

export default HabitLinkItemScoreInput;

const styles = StyleSheet.create({
  mt: { marginTop: hp(2) },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  inputWrap: {
    width: wp(90),
    height: hp(5.5),
    backgroundColor: Colors.content_back,
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
  },
  input: {
    width: wp(10), // Small width to accommodate the number
    height: hp(5.5),
    color: Colors.white,
    fontSize: wp(4.5),
    textAlign: 'right',
  },
  percentText: {
    color: 'rgba(134, 134, 134, 1)',
    fontSize: wp(4.5),
    marginRight: 'auto', // Pushes the % symbol to the left of the score code
    marginLeft: wp(1),
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: hp(2),
    height: hp(2),
    borderRadius: hp(1),
    marginRight: wp(2),
  },
  codeText: {
    color: Colors.white,
    fontSize: wp(4.5),
    fontWeight: '600',
    minWidth: wp(18), // Ensure space for longer codes like "EXCELLENT"
    textAlign: 'right',
  }
});