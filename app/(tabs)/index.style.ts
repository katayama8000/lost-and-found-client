import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
	},
	item: {
		backgroundColor: "#fff",
		padding: 20,
		marginVertical: 8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	info: {
		fontSize: 14,
		color: "#666",
	},
	// 色分けスタイル
	confirmed: {
		backgroundColor: "#d4edda",
		borderColor: "#c3e6cb",
	},
	unchecked: {
		backgroundColor: "#fff3cd",
		borderColor: "#ffeeba",
	},
	lost: {
		backgroundColor: "#f8d7da",
		borderColor: "#f5c6cb",
	},
	defaultStatus: {
		backgroundColor: "#ffffff",
	},
	nullInfo: {
		color: "#999",
	},
});
