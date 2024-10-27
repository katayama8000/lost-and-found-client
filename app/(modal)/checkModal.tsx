import { db } from "@/config/firebase";
import { tripId, userId } from "@/constants/Ids";
import { itemConverter } from "@/converter/itemConverter";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
	Alert,
	Button,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { Item } from "../(tabs)";

const checkModal = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
	const { ids } = useLocalSearchParams();

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
			const filteredItems = itemList.filter((item) => ids.includes(item.id));
			setItems(filteredItems);

			// Initialize statuses with default values
			const initialStatuses: { [key: string]: string } = {};
			for (const item of filteredItems) {
				initialStatuses[item.id] = item.status;
			}
			setStatuses(initialStatuses);
		} catch (error) {
			console.error("Error fetching items from Firestore:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchItems();
	}, []);

	const handleStatusChange = (itemId: string, status: string) => {
		setStatuses((prevStatuses) => ({ ...prevStatuses, [itemId]: status }));
	};

	const handleSubmit = () => {
		console.log("Submitted statuses:", statuses);
		Alert.alert(
			"Statuses submitted",
			"Your item statuses have been submitted.",
		);
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.header}>Item Status Check</Text>
			{items.map((item) => (
				<View key={item.id} style={styles.itemContainer}>
					<Text style={styles.itemName}>{item.name}</Text>
					<Text>最終通知日時: {item.lastNotifiedAt || "未設定"}</Text>
					<Text>最終確認日時: {item.lastConfirmedAt || "未設定"}</Text>
					<View style={styles.buttonGroup}>
						{["ある", "ない", "			"].map((status) => (
							<TouchableOpacity
								key={status}
								style={[
									styles.statusButton,
									statuses[item.id] === status && styles.selectedButton,
									// status === "ある"
									// 	? styles.confirmedButton
									// 	: status === "ない"
									// 		? styles.uncheckedButton
									// 		: styles.unknownButton,

									// 三項演算子を使ってもいいけど、Mapを使うともっと簡潔に書ける
									styles[
										`${status === "ある" ? "confirmed" : status === "ない" ? "unchecked" : "unknown"}Button`
									],
								]}
								onPress={() => handleStatusChange(item.id, status)}
							>
								<Text style={styles.buttonText}>{status}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			))}
			<Button title="Submit" onPress={handleSubmit} />
		</ScrollView>
	);
};

export default checkModal;

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	itemContainer: {
		padding: 15,
		marginBottom: 20,
		backgroundColor: "#ffffff",
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	itemName: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
	},
	buttonGroup: {
		flexDirection: "row",
		marginTop: 10,
		justifyContent: "space-between",
	},
	statusButton: {
		flex: 1,
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		alignItems: "center",
	},
	selectedButton: {
		borderColor: "#000",
		borderWidth: 1,
	},
	confirmedButton: {
		backgroundColor: "#4CAF50", // Green for "ある"
	},
	uncheckedButton: {
		backgroundColor: "#F44336", // Red for "ない"
	},
	unknownButton: {
		backgroundColor: "#FFC107", // Yellow for "わからない"
	},
	buttonText: {
		color: "#ffffff",
		fontWeight: "bold",
	},
});
