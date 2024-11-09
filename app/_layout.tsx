import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import { db } from "@/config/firebase";
import { userId } from "@/constants/Ids";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, setDoc } from "firebase/firestore";
import { Platform, View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

function handleRegistrationError(errorMessage: string) {
	alert(errorMessage);
	throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			handleRegistrationError(
				"Permission not granted to get push token for push notification!",
			);
			return;
		}
		const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ??
			Constants?.easConfig?.projectId;
		if (!projectId) {
			handleRegistrationError("Project ID not found");
		}
		try {
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			return pushTokenString;
		} catch (e: unknown) {
			handleRegistrationError(`${e}`);
		}
	} else {
		handleRegistrationError("Must use physical device for push notifications");
	}
}

const storePushToken = async (token: string) => {
	await setDoc(doc(db, "users", userId), {
		pushToken: token,
	});
};

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	const [expoPushToken, setExpoPushToken] = useState<string>("");
	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>(undefined);
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();
	const { push } = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => {
				if (token) {
					setExpoPushToken(token);
					storePushToken(token);
				}
			})
			.catch((error) => setExpoPushToken(`${error}`));

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
				console.log(notification.request.content.data);
				push({
					pathname: "/checkModal",
					params: notification.request.content.data,
				});
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log(response);
			});

		return () => {
			notificationListener.current &&
				Notifications.removeNotificationSubscription(
					notificationListener.current,
				);
			responseListener.current &&
				Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={DefaultTheme}>
			<View style={{ height: 30 }} />
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="(modal)/checkModal"
					options={{ presentation: "modal" }}
				/>
				<Stack.Screen name="+not-found" />
			</Stack>
		</ThemeProvider>
	);
}
