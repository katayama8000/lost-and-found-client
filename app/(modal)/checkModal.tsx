import { db } from "@/config/firebase";
import { tripId, userId } from "@/constants/Ids";
import { itemConverter } from "@/converter/itemConverter";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { Colors } from "react-native/Libraries/NewAppScreen";
import type { Item } from "../(tabs)";

const ItemStatusModal: FC = () => {
	const [items, setItems] = useState<Item[]>([]);
	const { ids } = useLocalSearchParams();
	const { back } = useRouter();

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
		} catch (error) {
			console.error("Error loading items from Firestore:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		(async () => {
			await fetchItems();
			// Reset all statuses to undefined to prevent accidental submission
			setItems((prevItems) =>
				prevItems.map((item) => ({ ...item, status: undefined })),
			);
		})();
	}, []);

	const changeItemStatus = (itemId: string, status: string) => {
		setItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId ? { ...item, status } : item,
			),
		);
	};

	const submitStatuses = async () => {
		if (items.some((item) => item.status === undefined)) {
			Alert.alert("Error", "Please select a status for all items.");
			return;
		}
		console.log(
			"Submitted item statuses:",
			items.map((item) => ({ id: item.id, status: item.status })),
		);
		Alert.alert(
			"Statuses submitted",
			"Your item statuses have been submitted.",
		);

		const statusMap: Record<
			Exclude<Item["status"], undefined>,
			"checked" | "unchecked" | "lost"
		> = {
			ある: "checked",
			わからない: "unchecked",
			ない: "lost",
		};

		const todayInJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
		for (const item of items) {
			await setDoc(
				doc(db, "users", userId, "trips", tripId, "items", item.id),
				{
					...item,
					lastConfirmedAt:
						item.status === "ある"
							? todayInJST.toISOString()
							: item.lastConfirmedAt,
					// status can't be undefined here
					status: statusMap[item.status as Exclude<Item["status"], undefined>],
				},
			);
		}
		back();
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
				return "わからない";
			case "lost":
				return "ない";
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
						{(["ある", "わからない", "ない"] as const).map((status) => (
							<TouchableOpacity
								key={status}
								style={[
									styles.statusButton,
									item.status === status && styles.selectedButton,
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
			<TouchableOpacity
				onPress={submitStatuses}
				style={{
					backgroundColor: Colors.primary,
					padding: 10,
					borderRadius: 5,
				}}
			>
				<Text
					style={{ color: "#ffffff", textAlign: "center", fontWeight: "bold" }}
				>
					送信
				</Text>
			</TouchableOpacity>
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
