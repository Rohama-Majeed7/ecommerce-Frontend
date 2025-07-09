import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../store/authSlice"
// Save to localStorage function
function saveToLocalStorage(state) {
  try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('reduxState', serializedState);
  } catch (e) {
      console.warn('Error saving to localStorage', e);
  }
}
// Load from localStorage function
function loadFromLocalStorage() {
  try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
  } catch (e) {
      console.warn('Error loading from localStorage', e);
      return undefined;
  }
}
export const store = configureStore({
    reducer: {
      authenticator:authReducer
    },
    preloadedState: loadFromLocalStorage()
  });
  // Subscribe to store updates
store.subscribe(() => saveToLocalStorage(store.getState()));
