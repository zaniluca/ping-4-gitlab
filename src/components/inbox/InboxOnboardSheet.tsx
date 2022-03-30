import { StyleSheet, Text, View } from "react-native";
import React from "react";
import BottomSheet from "@gorhom/bottom-sheet";

const InboxOnboardSheet = () => {
  return (
    <BottomSheet
      style={styles.sheet}
      index={1}
      snapPoints={["40%", "75%"]}
      handleStyle={{ opacity: 0.2 }}
    >
      <View style={styles.contentContainer}>
        <Text>Awesome</Text>
      </View>
    </BottomSheet>
  );
};

export default InboxOnboardSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  sheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
