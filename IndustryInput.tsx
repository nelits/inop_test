import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API = "https://dev-api.inop.ai/api/v1/shared/industries";

const IndustryInput = () => {
  const [suggestionData, setSuggestionData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const fetchSuggestionData = async () => {
    try {
      const response = await axios.get(API);
      if (response.status === 200) {
        setSuggestionData(response.data);
      }
    } catch (error) {
      console.log("There was an error fetching industries data.");
    }
  };

  useEffect(() => {
    fetchSuggestionData();
  }, []);

  const renderSuggestionItem = (item: { id: string; name: string }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          pressed && styles.pressedItem,
          styles.listItem,
        ]}
        onPress={() => submitSelection(item.name)}
      >
        <Text numberOfLines={1}>{item.name}</Text>
      </Pressable>
    );
  };

  const submitSelection = (text: string) => {
    setSelectedIndustry(text);
    setInputValue("");
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.input}>
        <TextInput
          style={{ width: "90%" }}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          onSubmitEditing={({ nativeEvent: { text } }) => submitSelection(text)}
          placeholder="Select industry..."
          clearButtonMode="always"
          numberOfLines={1}
        />
        {Platform.OS === "android" && inputValue !== "" ? (
          <Ionicons
            name={"close"}
            style={{ padding: 5 }}
            onPress={() => {
              setInputValue("");
              Keyboard.dismiss();
            }}
          />
        ) : null}
      </View>
      {inputValue !== "" ? (
        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.id}
          data={suggestionData.filter((industry) =>
            industry.name.toUpperCase().startsWith(inputValue.toUpperCase())
          )}
          renderItem={({ item }) => renderSuggestionItem(item)}
          keyboardShouldPersistTaps="always"
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: "rgba(134,134,134,0.48)",
              }}
            />
          )}
        />
      ) : (
        <Text numberOfLines={3} style={styles.selectedText}>
          {selectedIndustry}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default IndustryInput;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    paddingVertical: 40,
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    elevation: 1,
    borderRadius: 2,
  },
  list: {
    width: "95%",
    paddingHorizontal: 10,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  pressedItem: {
    backgroundColor: "rgba(94,32,246,0.24)",
  },
  selectedText: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 20,
  },
});
