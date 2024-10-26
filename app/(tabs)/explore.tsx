import React, { useState } from "react";
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const FormScreen = () => {
	// 旅行名の状態
	const [tripTitle, setTripTitle] = useState("");

	// アイテムの状態
	const [itemTitle, setItemTitle] = useState("");
	const [interval, setInterval] = useState<number | null>(null);
	const [items, setItems] = useState<
		{
			title: string;
			interval: number;
		}[]
	>([]);

	// アイテム追加ハンドラ
	const handleAddItem = () => {
		if (itemTitle !== "" && interval !== null) {
			const newItem = {
				title: itemTitle,
				interval: interval,
			};

			setItems([...items, newItem]);
			setItemTitle("");
			setInterval(null);
		}
	};

	// アイテム削除ハンドラ
	const handleDeleteItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	// フォーム送信ハンドラ
	const handleSubmit = () => {
		const tripData = {
			tripTitle,
			items,
		};

		console.log("送信データ:", tripData);

		// フォームをリセット
		setTripTitle("");
		setItems([]);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>フォーム</Text>

			{/* 旅行名 */}
			<Text style={styles.label}>旅行名</Text>
			<TextInput
				style={styles.input}
				placeholder="旅行名を入力"
				value={tripTitle}
				onChangeText={(text) => setTripTitle(text)}
			/>

			{/* アイテム名 */}
			<Text style={styles.label}>アイテム名</Text>
			<TextInput
				style={styles.input}
				placeholder="アイテム名を入力"
				value={itemTitle}
				onChangeText={(text) => setItemTitle(text)}
			/>

			{/* 通知間隔 */}
			<Text style={styles.label}>通知間隔 (例: 1h, 3h, 5h)</Text>
			<TextInput
				style={styles.input}
				placeholder="通知間隔を入力"
				value={interval?.toString() ?? ""}
				onChangeText={(text) => setInterval(Number(text))}
				keyboardType="numeric"
			/>

			{/* アイテム追加ボタン */}
			<Button title="アイテムを追加" onPress={handleAddItem} color="#1E90FF" />

			{/* 追加されたアイテムのリスト */}
			<FlatList
				data={items}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => (
					<View style={styles.item}>
						<Text style={styles.itemTitle}>{item.title}</Text>
						<Text style={styles.itemInterval}>通知間隔: {item.interval}h</Text>
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={() => handleDeleteItem(index)}
						>
							<Text style={styles.deleteButtonText}>削除</Text>
						</TouchableOpacity>
					</View>
				)}
			/>

			{/* 送信ボタン */}
			<Button title="送信" onPress={handleSubmit} color="#32CD32" />
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
		color: "#333",
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: "#555",
	},
	input: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#fff",
	},
	item: {
		padding: 15,
		marginVertical: 8,
		backgroundColor: "#e0f7fa",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#00796b",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#00796b",
	},
	itemInterval: {
		fontSize: 16,
		color: "#444",
	},
	deleteButton: {
		backgroundColor: "#ff6347",
		borderRadius: 5,
		padding: 5,
	},
	deleteButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

export default FormScreen;
