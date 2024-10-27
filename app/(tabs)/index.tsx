import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import type React from "react";
import { type FC, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { itemConverter } from "../../converter/itemConverter";
import { styles } from "./index.style";

export type Item = {
	id: string;
	name: string;
	notificationInterval: number | null;
	lastNotifiedAt: string | null;
	isNotifyEnabled: boolean;
	lastConfirmedAt: string | null;
	status: string;
};

const HomeScreen = () => {
	const [items, setItems] = useState<Item[]>([]);
	const userId = "katayama8000"; // Replace with the current user's ID
	const tripId = "XM3tC0Wi1Mw0IHcBgobR"; // Replace with the actual trip ID you want to fetch items for

	const getStatusColor = (status: string) => {
		switch (status) {
			case "確認":
				return styles.confirmed;
			case "確認していない":
				return styles.unchecked;
			case "無くした":
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.header}>バリ旅行</Text>
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
		<View style={[styles.item, getStatusColor(item.status)]}>
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
