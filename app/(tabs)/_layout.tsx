import type React from "react";
import { useState } from "react";
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type Item = {
	title: string;
	interval: number;
};

type DropDownItem = {
	label: string;
	value: number;
};

const FormScreen: React.FC = () => {
	// States
	const [tripTitle, setTripTitle] = useState<string>("");
	const [itemTitle, setItemTitle] = useState<string>("");
	const [interval, setInterval] = useState<number | null>(null);
	const [items, setItems] = useState<Item[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<number | null>(null);
	const [Ditems, setDItems] = useState<DropDownItem[]>([
		{ label: "1h", value: 1 },
		{ label: "3h", value: 3 },
		{ label: "5h", value: 5 },
	]);

	// Handlers
	const handleAddItem = (): void => {
		if (itemTitle !== "" && interval !== null) {
			const newItem: Item = {
				title: itemTitle,
				interval: interval,
			};
			setItems([...items, newItem]);
			setItemTitle("");
			setInterval(null);
		}
	};

	const handleDeleteItem = (index: number): void => {
		setItems(items.filter((_, i) => i !== index));
	};

	const handleSubmit = (): void => {
		const tripData = {
			tripTitle,
			items,
		};

		console.log("送信データ:", tripData);

		// Reset form
		setTripTitle("");
		setItems([]);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>旅行プラン作成フォーム</Text>

			{/* Trip Title */}
			<Text style={styles.label}>旅行名</Text>
			<TextInput
				style={styles.input}
				placeholder="旅行名を入力"
				value={tripTitle}
				onChangeText={(text) => setTripTitle(text)}
			/>

			{/* Item Name */}
			<Text style={styles.label}>アイテム名</Text>
			<TextInput
				style={styles.input}
				placeholder="アイテム名を入力"
				value={itemTitle}
				onChangeText={(text) => setItemTitle(text)}
			/>

			{/* Notification Interval */}
			<Text style={styles.label}>通知間隔 (例: 1h, 3h, 5h)</Text>
			<DropDownPicker
				open={open}
				value={value}
				items={Ditems}
				setOpen={setOpen}
				setValue={(val) => {
					setValue(val);
					setInterval(val || null);
				}}
				setItems={setDItems}
				placeholder="選択してください"
			/>

			{/* Add Item Button */}
			<TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
				<Text style={styles.addButtonText}>アイテムを追加</Text>
			</TouchableOpacity>

			{/* List of Added Items */}
			<FlatList
				data={items}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item, index }) => (
					<View style={styles.item}>
						<View>
							<Text style={styles.itemTitle}>{item.title}</Text>
							<Text style={styles.itemInterval}>
								通知間隔: {item.interval}h
							</Text>
						</View>
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={() => handleDeleteItem(index)}
						>
							<Text style={styles.deleteButtonText}>削除</Text>
						</TouchableOpacity>
					</View>
				)}
			/>

			{/* Submit Button */}
			<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
				<Text style={styles.submitButtonText}>送信</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f0f4f8",
	},
	header: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#2d2d2d",
	},
	label: {
		fontSize: 18,
		marginBottom: 10,
		color: "#333",
	},
	input: {
		height: 50,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 15,
		marginVertical: 8,
		backgroundColor: "#ffffff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
		borderLeftWidth: 5,
		borderLeftColor: "#00796b",
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#00796b",
	},
	itemInterval: {
		fontSize: 16,
		color: "#555",
	},
	addButton: {
		backgroundColor: "#1E90FF",
		paddingVertical: 12,
		borderRadius: 8,
		marginBottom: 20,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	deleteButton: {
		backgroundColor: "#ff6347",
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	deleteButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	submitButton: {
		backgroundColor: "#32CD32",
		paddingVertical: 15,
		borderRadius: 8,
		marginTop: 10,
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default FormScreen;
