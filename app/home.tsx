import { View, Text, Pressable, Image, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import { FlashList } from "@shopify/flash-list";
import LoadingDots from "react-native-loading-dots";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import SafeView from "@/components/SafeView";
import { MessageType } from "@/types";

const Home = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { mutate: generateCaption, isPending } = useMutation({
    mutationKey: ["generate-caption"],
    mutationFn: async (image: string) => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/generate-caption`,
        { image }
      );
      return data as { caption: string };
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { by: "ai", content: data.caption }]);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return;
    }

    const base64 = `data:image/png;base64,${result.assets?.[0].base64}`;

    setMessages((prev) => [
      ...prev,
      {
        by: "user",
        content: base64,
      },
    ]);

    generateCaption(result.assets?.[0].base64 as string);
  }, [messages]);
  return (
    <SafeView style={tw`pb-16`}>
      {messages.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center gap-y-6`}>
          <Image
            source={require("../assets/images/logo.png")}
            style={tw`w-40 h-40`}
            resizeMode="stretch"
          />
          <View style={tw`gap-y-2 items-center`}>
            <Text style={tw`text-white text-3xl font-medium`}>
              Image Caption Generator
            </Text>
            <Text style={tw`text-gray-300`}>
              Generate captions for your images
            </Text>
          </View>
        </View>
      ) : (
        <FlashList
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => {
            return (
              <View
                style={tw`w-full px-5 ${
                  item.by === "ai" ? "items-start" : "items-end"
                }`}
              >
                <View
                  style={tw`${
                    item.by === "ai"
                      ? "bg-gray-700 p-3"
                      : "bg-blue-600 items-center justify-center p-2"
                  } w-[80%] rounded-lg mb-5`}
                >
                  {item.by === "ai" ? (
                    <Text style={tw`text-white text-base`}>{item.content}</Text>
                  ) : (
                    <Image
                      source={{ uri: item.content }}
                      style={tw`w-full rounded-lg h-[250px]`}
                      resizeMode="stretch"
                    />
                  )}
                </View>
              </View>
            );
          }}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={tw`absolute bottom-0 w-full px-5`}>
        {isPending ? (
          <View style={tw`w-full items-center pb-5`}>
            <View style={tw`w-[30%]`}>
              <LoadingDots />
            </View>
          </View>
        ) : (
          <Pressable
            style={tw`bg-blue-600 py-3 items-center justify-center rounded-xl`}
            onPress={pickImage}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-medium`}>
              Select Image
            </Text>
          </Pressable>
        )}
      </View>
    </SafeView>
  );
};

export default Home;
