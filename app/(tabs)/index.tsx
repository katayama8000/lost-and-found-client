import { db } from "@/config/firebase";
import { tripId, userId } from "@/constants/Ids";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import type React from "react";
import { type FC, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { itemConverter } from "../../converter/itemConverter";
import { styles } from "../styles/index.style";

export type Item = {
	id: string;
	name: string;
	reminderInterval: number | null;
	lastNotifiedAt: string | null;
	isNotifyEnabled: boolean;
	lastConfirmedAt: string | null;
	status: string | undefined;
};

const HomeScreen = () => {
	const [items, setItems] = useState<Item[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "checked":
				return styles.confirmed;
			case "unchecked":
				return styles.unchecked;
			case "lost":
				return styles.lost;
			default:
				return styles.defaultStatus;
		}
	};

	const fetchItems = async () => {
		try {
			const itemsCollection = collection(
				db,
				"users",
				userId,
				"trips",
				tripId,
				"items",
			).withConverter(itemConverter);
			const itemSnapshot = await getDocs(itemsCollection);
			const itemList = itemSnapshot.docs.map((doc) => doc.data());

			setItems(itemList);
		} catch (error) {
			console.error("Error fetching items from Firestore:", error);
		}
	};

	useFocusEffect(() => {
		fetchItems();
	});

	return (
		<View style={styles.container}>
			<Text style={styles.header}>旅行</Text>
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<Item item={item} getStatusColor={getStatusColor} />
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

type ItemProps = {
	item: Item;
	getStatusColor: (status: string) => object;
};

const Item: FC<ItemProps> = ({ item, getStatusColor }) => {
	return (
		<View
			style={[styles.item, getStatusColor(item.status ?? "確認していない")]}
		>
			<Text style={styles.title}>{item.name}</Text>
			{item.lastNotifiedAt ? (
				<Text style={styles.info}>最終通知日時: {item.lastNotifiedAt}</Text>
			) : (
				<Text style={[styles.info, styles.nullInfo]}>通知なし</Text>
			)}
			{item.lastConfirmedAt ? (
				<Text style={styles.info}>最終確認日時: {item.lastConfirmedAt}</Text>
			) : (
				<Text style={[styles.info, styles.nullInfo]}>未確認</Text>
			)}
		</View>
	);
};

export default HomeScreen;
