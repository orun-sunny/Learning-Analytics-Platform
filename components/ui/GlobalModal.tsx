"use client";
import React from 'react';
import { useUIStore } from '@/store/uiStore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, HelpCircle } from 'lucide-react';

export const GlobalModal = () => {
  const { modal, hideModal } = useUIStore();

  if (!modal) return null;

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    hideModal();
  };

  const handleCancel = () => {
    if (modal.onCancel) modal.onCancel();
    hideModal();
  };

  return (
    <Dialog open={!!modal} onOpenChange={(open) => !open && hideModal()}>
      <DialogContent className="sm:max-w-md border-none shadow-2xl rounded-3xl overflow-hidden p-0">
        <div className="bg-white p-6 md:p-8 flex flex-col items-center text-center gap-6">
          <div className={`p-4 rounded-full ${modal.type === 'alert' ? 'bg-amber-50 text-amber-500' : 'bg-[#6633FF]/10 text-[#6633FF]'}`}>
            {modal.type === 'alert' ? (
              <AlertCircle size={40} />
            ) : (
              <HelpCircle size={40} />
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-slate-800 text-2xl font-bold">
              {modal.title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-base leading-relaxed">
              {modal.message}
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="bg-gray-50/50 p-6 flex flex-col sm:flex-row gap-3 border-t border-gray-100">
          {modal.type === 'confirm' && (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:flex-1 py-6 rounded-xl border-gray-200 text-slate-600 font-bold hover:bg-white"
            >
              {modal.cancelText || 'Cancel'}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className={`w-full sm:flex-1 py-6 rounded-xl font-bold shadow-lg transition-all ${
              modal.type === 'alert' 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' 
                : 'bg-[#6633FF] hover:bg-[#5229CC] shadow-[#6633FF]/20'
            }`}
          >
            {modal.confirmText || (modal.type === 'alert' ? 'Got it' : 'Confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
