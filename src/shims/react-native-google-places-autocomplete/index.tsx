"use client";

import React, { useState } from "react";
import { TextInput, View } from "react-native";

// GooglePlacesAutocomplete web fallback: same input styling props, manual text
// entry submitted on Enter (Google Maps web key not available — flagged env gap;
// wire the Places REST API here once the key is provided).
export const GooglePlacesAutocomplete = React.forwardRef<any, any>(function GooglePlacesAutocomplete(
  { placeholder, onPress, textInputProps, styles: propStyles, ...rest },
  ref
) {
  const [text, setText] = useState("");
  void rest;

  const submit = () => {
    if (!text.trim()) return;
    onPress?.({ description: text.trim() }, null);
  };

  return (
    <View style={propStyles?.container}>
      <TextInput
        ref={ref}
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        onBlur={submit}
        style={propStyles?.textInput}
        placeholderTextColor={textInputProps?.placeholderTextColor}
        {...textInputProps}
      />
    </View>
  );
});

export default GooglePlacesAutocomplete;
