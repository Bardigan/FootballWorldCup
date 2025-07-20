import { useState, useCallback } from 'react';
import type { ConfirmationButton } from '../components/modal/ConfirmationModal';

interface ConfirmationOptions {
  title: string;
  message: string;
  buttons: ConfirmationButton[];
}

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);

  const showConfirmation = useCallback((confirmationOptions: ConfirmationOptions) => {
    setOptions(confirmationOptions);
    setIsOpen(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  return {
    isOpen,
    options,
    showConfirmation,
    hideConfirmation,
  };
};