import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const QUEUE_KEY = "OFFLINE_QUEUE";

interface QueuedAction {
  id: string;
  method: "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: any;
  timestamp: number;
}

export const offlineQueueService = {
  async enqueue(action: Omit<QueuedAction, "id" | "timestamp">) {
    const queue = await this.getQueue();
    const newAction: QueuedAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    queue.push(newAction);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return newAction;
  },

  async getQueue(): Promise<QueuedAction[]> {
    const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  },

  async processQueue() {
    const queue = await this.getQueue();
    const results = [];

    for (const action of queue) {
      try {
        const response = await api.request({
          method: action.method,
          url: action.url,
          data: action.data,
        });
        results.push({ action, success: true, response });
      } catch (error) {
        results.push({ action, success: false, error });
        // Se falhar, mantém na fila
        break;
      }
    }

    // Remove ações bem-sucedidas da fila
    const successfulIds = results
      .filter((r) => r.success)
      .map((r) => r.action.id);

    const remainingQueue = queue.filter((a) => !successfulIds.includes(a.id));
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));

    return results;
  },

  async clearQueue() {
    await AsyncStorage.removeItem(QUEUE_KEY);
  },
};
