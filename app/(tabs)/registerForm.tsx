import { db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";
import type React from "react";
import { type FC, useState } from "react";
import {
	Alert,
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./registerForm.style";

type ScheduleItem = {
	name: string;
	reminderInterval: number;
};

const registerForm: FC = () => {
	const [tripDestination, setTripDestination] = useState<string>("");
	const [itemName, setItemName] = useState<string>("");
	const [reminderInterval, setreminderInterval] = useState<number | null>(null);
	const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [dropdownValue, setDropdownValue] = useState<number | null>(null);
	const [dropdownOptions, setDropdownOptions] = useState<
		{ label: string; value: number }[]
	>([
		{ label: "1時間", value: 1 },
		{ label: "3時間", value: 3 },
		{ label: "5時間", value: 5 },
	]);

	const addScheduleItem = () => {
		if (!itemName || reminderInterval === null) return;
		setScheduleItems([
			...scheduleItems,
			{ name: itemName, reminderInterval: reminderInterval },
		]);
		setItemName("");
		setreminderInterval(null);
		setDropdownValue(null);
	};

	const removeScheduleItem = (index: number) => {
		setScheduleItems(scheduleItems.filter((_, i) => i !== index));
	};

	const submitTripPlan = async () => {
		const userId = "katayama8000"; // TODO: Firebase AuthでログインしているユーザーのIDを取得する
		try {
			const tripRef = await addDoc(collection(db, "users", userId, "trips"), {
				destination: tripDestination,
			});

			for (const item of scheduleItems) {
				await addDoc(
					collection(db, "users", userId, "trips", tripRef.id, "items"),
					{
						name: item.name,
						reminderInterval: item.reminderInterval,
						lastNotifiedAt: null,
						isNotifyEnabled: true,
						lastConfirmedAt: null,
						status: "unchecked",
					},
				);
			}

			Alert.alert("通知を設定しました");
			setTripDestination("");
			setScheduleItems([]);
		} catch (error) {
			console.error("Firestoreへの送信エラー:", error);
		}
	};

	const isAddButtonDisabled = !itemName || reminderInterval === null;
	const isSubmitButtonDisabled = !tripDestination || scheduleItems.length === 0;

	return (
		<View style={styles.container}>
			<Text style={styles.header}>通知設定</Text>

			<Text style={styles.label}>行き先</Text>
			<TextInput
				style={styles.input}
				placeholder="行き先を入力"
				value={tripDestination}
				onChangeText={setTripDestination}
				placeholderTextColor={"#C0C0C0"}
			/>

			<Text style={styles.label}>通知アイテム名</Text>
			<TextInput
				style={styles.input}
				placeholder="アイテム名を入力"
				value={itemName}
				onChangeText={setItemName}
				placeholderTextColor={"#C0C0C0"}
			/>

			<Text style={styles.label}>通知間隔</Text>
			<DropDownPicker
				open={isDropdownOpen}
				value={dropdownValue}
				items={dropdownOptions}
				setOpen={setIsDropdownOpen}
				setValue={(val) => {
					setDropdownValue(val);
					setreminderInterval(val ?? null);
				}}
				setItems={setDropdownOptions}
				placeholder="通知間隔を選択"
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

export default registerForm;
