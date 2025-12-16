import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const NAVIGATION_STATE_KEY = "NAVIGATION_STATE";

export function useNavigationPersistence() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(
          NAVIGATION_STATE_KEY
        );
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  const onStateChange = async (state: any) => {
    await AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
  };

  return {
    isReady,
    initialState,
    onStateChange,
  };
}
