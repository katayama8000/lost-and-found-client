import type { Item } from "@/app/(tabs)";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const itemConverter = {
	toFirestore: (item: Item): DocumentData => {
		return {
			name: item.name,
			notificationInterval: item.notificationInterval,
			lastNotifiedAt: item.lastNotifiedAt,
			isNotifyEnabled: item.isNotifyEnabled,
			lastConfirmedAt: item.lastConfirmedAt,
			status: item.status,
		};
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot): Item => {
		const data = snapshot.data();
		return {
			id: snapshot.id,
			name: data.name,
			notificationInterval: data.notificationInterval,
			lastNotifiedAt: data.lastNotifiedAt,
			isNotifyEnabled: data.isNotifyEnabled,
			lastConfirmedAt: data.lastConfirmedAt,
			status: data.status,
		};
	},
};
