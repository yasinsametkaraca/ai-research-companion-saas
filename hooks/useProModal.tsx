import {create} from 'zustand';

interface useProModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

// Zustand store for modal state. useProModal is a hook that can be used to open and close a modal.
export const useProModal = create<useProModalStore>((set) => ({
    isOpen: false, // Initial state of modal
    onOpen: () => set({isOpen: true}), // Function to open modal
    onClose: () => set({isOpen: false}), // Function to close modal
}));

