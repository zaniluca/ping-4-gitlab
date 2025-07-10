import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { InboxStackParamList, RootStackParamList } from "../navigation/types";

type NestedStackParamList = RootStackParamList & InboxStackParamList;

export const useRootStackNavigation = () =>
  useNavigation<NativeStackNavigationProp<NestedStackParamList>>();
