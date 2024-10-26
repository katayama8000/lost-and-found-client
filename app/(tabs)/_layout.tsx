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
			<Text style={styles.header}>旅行プラン作成フォーム</Text>

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
			<TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
				<Text style={styles.addButtonText}>アイテムを追加</Text>
			</TouchableOpacity>

			{/* 追加されたアイテムのリスト */}
			<FlatList
				data={items}
				keyExtractor={(item, index) => index.toString()}
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

			{/* 送信ボタン */}
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
