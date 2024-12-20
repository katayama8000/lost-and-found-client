import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.light.tint,
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "home" : "home-outline"}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="registerForm"
				options={{
					title: "登録",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "code-slash" : "code-slash-outline"}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
