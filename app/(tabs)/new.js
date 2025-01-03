// app/New.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Notifications from "expo-notifications";

const NewPage = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);

  // 設置通知接收的處理程序
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
    }),
  });

  useEffect(() => {
    // 請求通知權限並獲取推播令牌
    const getPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync(); // 使用expo-notifications來請求權限
      if (status === "granted") {
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(token.data); // 記錄設備的推播令牌
      } else {
        Alert.alert("Permission not granted", "Notification permission is required!");
      }
    };

    getPermission();

    // 設置接收通知的監聽
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification); // 儲存收到的通知
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 發送本地通知
  const triggerLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification!",
        data: { extraData: "This is extra data" },
      },
      trigger: { seconds: 2 }, // 設定通知在 2 秒後觸發
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>This is the New Page!</Text>

      {/* 顯示推播令牌 */}
      <Text style={{ marginBottom: 20 }}>Expo Push Token: {expoPushToken ? expoPushToken : "Fetching..."}</Text>

      {/* 按鈕觸發本地通知 */}
      <Button title="Send Test Notification" onPress={triggerLocalNotification} />

      {/* 顯示接收到的通知 */}
      {notification && (
        <View style={{ marginTop: 20 }}>
          <Text>Notification received:</Text>
          <Text>{notification.request.content.body}</Text>
        </View>
      )}
    </View>
  );
};

export default NewPage;
