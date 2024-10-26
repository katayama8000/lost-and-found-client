import { Colors } from "@/constants/Colors";
import type React from "react";
import { type FC, useState } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type ScheduleItem = {
	name: string;
	reminderInterval: number;
};

const TripPlanner: FC = () => {
	const [tripName, setTripName] = useState<string>("");
	const [scheduleName, setScheduleName] = useState<string>("");
	const [reminderInterval, setReminderInterval] = useState<number | null>(null);
	const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [dropdownValue, setDropdownValue] = useState<number | null>(null);
	const [dropdownOptions, setDropdownOptions] = useState<
		{ label: string; value: number }[]
	>([
		{ label: "1h", value: 1 },
		{ label: "3h", value: 3 },
		{ label: "5h", value: 5 },
	]);

	const addScheduleItem = () => {
		if (!scheduleName || reminderInterval === null) return;
		setScheduleItems([
			...scheduleItems,
			{ name: scheduleName, reminderInterval },
		]);
		setScheduleName("");
		setReminderInterval(null);
		setDropdownValue(null);
	};

	const removeScheduleItem = (index: number) => {
		setScheduleItems(scheduleItems.filter((_, i) => i !== index));
	};

	const submitTripPlan = () => {
		const tripData = { tripName, scheduleItems };
		console.log("送信データ:", tripData);
		setTripName("");
		setScheduleItems([]);
	};

	// ボタンが押せるかどうかのフラグ
	const isAddButtonDisabled = !scheduleName || reminderInterval === null;
	const isSubmitButtonDisabled = !tripName || scheduleItems.length === 0;

	return (
		<View style={styles.container}>
			<Text style={styles.header}>旅行プラン作成フォーム</Text>

			<Text style={styles.label}>旅行名</Text>
			<TextInput
				style={styles.input}
				placeholder="旅行名を入力"
				value={tripName}
				onChangeText={setTripName}
			/>

			<Text style={styles.label}>アイテム名</Text>
			<TextInput
				style={styles.input}
				placeholder="アイテム名を入力"
				value={scheduleName}
				onChangeText={setScheduleName}
			/>

			<Text style={styles.label}>通知間隔</Text>
			<DropDownPicker
				open={isDropdownOpen}
				value={dropdownValue}
				items={dropdownOptions}
				setOpen={setIsDropdownOpen}
				setValue={(val) => {
					setDropdownValue(val);
					setReminderInterval(val ?? null);
				}}
				setItems={setDropdownOptions}
				placeholder="間隔を選択"
				style={styles.dropdown}
				dropDownContainerStyle={styles.dropdownContainer}
			/>

			<TouchableOpacity
				style={[styles.addButton, isAddButtonDisabled && styles.disabledButton]}
				onPress={addScheduleItem}
				disabled={isAddButtonDisabled}
			>
				<Text style={styles.addButtonText}>+ アイテムを追加</Text>
			</TouchableOpacity>

			<FlatList
				data={scheduleItems}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item, index }) => (
					<View style={styles.item}>
						<View>
							<Text style={styles.itemName}>{item.name}</Text>
							<Text style={styles.itemInterval}>
								通知間隔: {item.reminderInterval}h
							</Text>
						</View>
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={() => removeScheduleItem(index)}
						>
							<Text style={styles.deleteButtonText}>削除</Text>
						</TouchableOpacity>
					</View>
				)}
			/>

			<TouchableOpacity
				style={[
					styles.submitButton,
					isSubmitButtonDisabled && styles.disabledButton,
				]}
				onPress={submitTripPlan}
				disabled={isSubmitButtonDisabled}
			>
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
		color: Colors.primary,
	},
	label: {
		fontSize: 18,
		marginBottom: 10,
		color: Colors.primary,
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
		backgroundColor: Colors.primary,
		paddingVertical: 12,
		borderRadius: 10,
		marginVertical: 15,
		alignItems: "center",
		shadowColor: Colors.primary,
		shadowOpacity: 0.3,
		shadowOffset: { width: 0, height: 2 },
		elevation: 4,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	disabledButton: {
		backgroundColor: "#b0c4de",
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
		borderLeftColor: Colors.primary,
	},
	itemName: {
		fontSize: 18,
		fontWeight: "600",
		color: Colors.primary,
	},
	itemInterval: {
		fontSize: 16,
		color: "#555",
	},
	deleteButton: {
		backgroundColor: Colors.secondary,
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	deleteButtonText: {
		color: "#fff",
		fontWeight: "600",
	},
	submitButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 15,
		borderRadius: 10,
		marginTop: 10,
		alignItems: "center",
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});

export default TripPlanner;
