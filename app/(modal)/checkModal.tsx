import { db } from "@/config/firebase";
import { tripId, userId } from "@/constants/Ids";
import { itemConverter } from "@/converter/itemConverter";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { type FC, useEffect, useState } from "react";
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

const ItemStatusModal: FC = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [itemStatuses, setItemStatuses] = useState<Record<string, string>>({});
	const { ids } = useLocalSearchParams();

	const fetchItems = async () => {
		try {
			const itemsRef = collection(
				db,
				"users",
				userId,
				"trips",
				tripId,
				"items",
			).withConverter(itemConverter);
			const itemsSnapshot = await getDocs(itemsRef);
			const fetchedItems = itemsSnapshot.docs.map((doc) => doc.data());
			const filteredItems = fetchedItems.filter((item) =>
				ids.includes(item.id),
			);

			setItems(filteredItems);
			setItemStatuses(
				Object.fromEntries(filteredItems.map((item) => [item.id, item.status])),
			);
		} catch (error) {
			console.error("Error loading items from Firestore:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchItems();
	}, []);

	const changeItemStatus = (itemId: string, status: string) => {
		setItemStatuses((prevStatuses) => ({ ...prevStatuses, [itemId]: status }));
	};

	const submitStatuses = async () => {
		console.log("Submitted item statuses:", itemStatuses);
		Alert.alert(
			"Statuses submitted",
			"Your item statuses have been submitted.",
		);
		const statusMap: Record<Item["status"], "checked" | "unchecked" | "lost"> =
			{
				ある: "checked",
				ない: "unchecked",
				わからない: "lost",
			} as const;

		const today = new Date();
		console.log("Items:", items);
		for (const item of items) {
			await setDoc(
				doc(db, "users", userId, "trips", tripId, "items", item.id),
				{
					...item,
					lastConfirmedAt: today.toISOString(),
					status: statusMap[itemStatuses[item.id]],
				},
			);
		}
	};

	const statusStyles = {
		ある: styles.availableButton,
		ない: styles.unavailableButton,
		わからない: styles.unknownButton,
	} as const;

	const statusTranslation = (status: Item["status"]) => {
		switch (status) {
			case "checked":
				return "ある";
			case "unchecked":
				return "ない";
			case "lost":
				return "わからない";
			default:
				return "わからない";
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.header}>Item Status Check</Text>
			{items.map((item) => (
				<View key={item.id} style={styles.itemCard}>
					<Text style={styles.itemName}>{item.name}</Text>
					<Text>Last Notified: {item.lastNotifiedAt || "未設定"}</Text>
					<Text>Last Confirmed: {item.lastConfirmedAt || "未設定"}</Text>
					<Text>Current Status: {statusTranslation(item.status)}</Text>
					<View style={styles.buttonGroup}>
						{(["ある", "ない", "わからない"] as const).map((status) => (
							<TouchableOpacity
								key={status}
								style={[
									styles.statusButton,
									itemStatuses[item.id] === status && styles.selectedButton,
									statusStyles[status],
								]}
								onPress={() => changeItemStatus(item.id, status)}
							>
								<Text style={styles.statusButtonText}>{status}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			))}
			<Button title="Submit" onPress={submitStatuses} />
		</ScrollView>
	);
};

export default ItemStatusModal;

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
	itemCard: {
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
	availableButton: {
		backgroundColor: "#4CAF50",
	},
	unavailableButton: {
		backgroundColor: "#F44336",
	},
	unknownButton: {
		backgroundColor: "#FFC107",
	},
	statusButtonText: {
		color: "#ffffff",
		fontWeight: "bold",
	},
});
