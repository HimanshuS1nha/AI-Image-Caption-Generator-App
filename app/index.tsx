import { Image, Text, View } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";
import { useEffect } from "react";

import SafeView from "@/components/SafeView";

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 300);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <SafeView style={tw`items-center justify-center gap-y-6`}>
      <Image
        source={require("../assets/images/logo.png")}
        style={tw`w-40 h-40`}
        resizeMode="stretch"
      />
      <View style={tw`gap-y-2 items-center`}>
        <Text style={tw`text-white text-3xl font-medium`}>
          Image Caption Generator
        </Text>
        <Text style={tw`text-gray-300`}>Generate captions for your images</Text>
      </View>
    </SafeView>
  );
}
