import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	label: {
		fontSize: 18,
		marginBottom: 10,
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
