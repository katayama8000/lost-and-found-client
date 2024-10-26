import { db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import type React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
	const handleClick = async () => {
		await setDoc(doc(db, "cities", "LA"), {
			name: "Los Angeles",
			state: "CA",
			country: "USA",
		});
		alert("Document added!");
	};

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

	return (
		<View style={styles.container}>
			<Text style={styles.header}>バリ旅行</Text>
			<FlatList
				data={[
					{
						key: "1",
						title: "パスポート",
						interval: "1h",
						lastChecked: "確認",
					},
					{
						key: "2",
						title: "財布",
						interval: "3h",
						lastChecked: "確認していない",
					},
					{ key: "3", title: "指輪", interval: "5h", lastChecked: "無くした" },
				]}
				renderItem={({ item }) => (
					<Item item={item} getStatusColor={getStatusColor} />
				)}
				keyExtractor={(item) => item.key}
			/>
		</View>
	);
};

type ItemProps = {
	item: { title: string; interval: string; lastChecked: string };
	getStatusColor: (status: string) => object;
};

const Item: React.FC<ItemProps> = ({ item, getStatusColor }) => {
	return (
		<View style={[styles.item, getStatusColor(item.lastChecked)]}>
			<Text style={styles.title}>{item.title}</Text>
			<Text style={styles.info}>通知間隔: {item.interval}</Text>
			<Text style={styles.info}>最終操作: {item.lastChecked}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	item: {
		backgroundColor: "#fff",
		padding: 20,
		marginVertical: 8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	info: {
		fontSize: 14,
		color: "#666",
	},
	// 色分けスタイル
	confirmed: {
		backgroundColor: "#d4edda",
		borderColor: "#c3e6cb",
	},
	unchecked: {
		backgroundColor: "#fff3cd",
		borderColor: "#ffeeba",
	},
	lost: {
		backgroundColor: "#f8d7da",
		borderColor: "#f5c6cb",
	},
	defaultStatus: {
		backgroundColor: "#ffffff",
	},
});

export default HomeScreen;
