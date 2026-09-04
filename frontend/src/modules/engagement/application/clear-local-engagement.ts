import { engagementStore } from './engagement-service';

export function clearLocalEngagementData(owner?: string) {
  engagementStore.clear(owner);
}
