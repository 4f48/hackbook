import { writable } from 'svelte/store';

type NavigationState = 'loading' | 'loaded' | null;
export const navigationState = writable<NavigationState>(null);
