import { create } from 'zustand';

interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'alert' | 'confirm';
}

interface UIState {
  modal: ModalConfig | null;
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  modal: null,
  showModal: (config) => set({ modal: config }),
  hideModal: () => set({ modal: null }),
}));
