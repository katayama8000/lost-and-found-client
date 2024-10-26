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

const FormScreen: React.FC = () => {
	const [tripTitle, setTripTitle] = useState<string>("");
	const [itemTitle, setItemTitle] = useState<string>("");
	const [interval, setInterval] = useState<number | null>(null);
	const [items, setItems] = useState<Item[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<number | null>(null);
	const [Ditems, setDItems] = useState<{ label: string; value: number }[]>([
		{ label: "1h", value: 1 },
		{ label: "3h", value: 3 },
		{ label: "5h", value: 5 },
	]);

	const handleAddItem = () => {
		if (itemTitle && interval !== null) {
			setItems([...items, { title: itemTitle, interval }]);
			setItemTitle("");
			setInterval(null);
		}
	};

	const handleDeleteItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		const tripData = { tripTitle, items };
		console.log("送信データ:", tripData);
		setTripTitle("");
		setItems([]);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>旅行プラン作成フォーム</Text>

			<Text style={styles.label}>旅行名</Text>
			<TextInput
				style={styles.input}
				placeholder="旅行名を入力"
				value={tripTitle}
				onChangeText={setTripTitle}
			/>

			<Text style={styles.label}>アイテム名</Text>
			<TextInput
				style={styles.input}
				placeholder="アイテム名を入力"
				value={itemTitle}
				onChangeText={setItemTitle}
			/>

			<Text style={styles.label}>通知間隔</Text>
			<DropDownPicker
				open={open}
				value={value}
				items={Ditems}
				setOpen={setOpen}
				setValue={(val) => {
					setValue(val);
					setInterval(val ?? null);
				}}
				setItems={setDItems}
				placeholder="間隔を選択"
				style={styles.dropdown}
				dropDownContainerStyle={styles.dropdownContainer}
			/>

			<TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
				<Text style={styles.addButtonText}>アイテムを追加</Text>
			</TouchableOpacity>

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
		backgroundColor: "#f7fafc",
	},
	header: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#333",
	},
	label: {
		fontSize: 18,
		marginBottom: 10,
		color: "#444",
	},
	input: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	dropdown: {
		borderRadius: 10,
		borderColor: "#ccc",
		backgroundColor: "#fff",
	},
	dropdownContainer: {
		borderRadius: 10,
	},
	addButton: {
		backgroundColor: "#5b9bd5",
		paddingVertical: 12,
		borderRadius: 10,
		marginVertical: 15,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 15,
		marginVertical: 8,
		backgroundColor: "#e7f3ff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderLeftWidth: 5,
		borderLeftColor: "#5b9bd5",
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#3d85c6",
	},
	itemInterval: {
		fontSize: 16,
		color: "#555",
	},
	deleteButton: {
		backgroundColor: "#ff5252",
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	deleteButtonText: {
		color: "#fff",
		fontWeight: "600",
	},
	submitButton: {
		backgroundColor: "#4caf50",
		paddingVertical: 15,
		borderRadius: 10,
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
