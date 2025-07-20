import React from 'react';
import { Button } from '../ui/Button';
import { useModalBehavior } from '../../hooks/useModalBehavior';

export interface ConfirmationButton {
  text: string;
  variant: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

interface ModalDisplay {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalContent {
  title: string;
  message: string;
}

interface ModalActions {
  buttons: ConfirmationButton[];
}

interface ConfirmationModalProps extends ModalDisplay, ModalContent, ModalActions {
  ButtonComponent?: React.ComponentType<any>;
}

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-200">
    <h3 className="text-xl font-semibold text-gray-900 m-0" id="modal-title">
      {title}
    </h3>
    <Button
      onClick={onClose}
      variant="secondary"
      size="sm"
      className="bg-transparent border-none text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 w-8 h-8 min-w-0"
      aria-label="Close"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Button>
  </div>
);

const ModalContent: React.FC<{ message: string }> = ({ message }) => (
  <div className="px-6 py-4">
    <p className="text-gray-700 leading-relaxed m-0" id="modal-description">
      {message}
    </p>
  </div>
);

const ModalFooter: React.FC<{ 
  buttons: ConfirmationButton[]; 
  ButtonComponent: React.ComponentType<any>;
}> = ({ buttons, ButtonComponent }) => {
  if (buttons.length === 0) return null;

  const [leftButton, ...rightButtons] = buttons;

  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-5 bg-gray-50 border-t border-gray-200 max-sm:flex-col max-sm:gap-3">
      <div className="flex items-center max-sm:w-full max-sm:justify-center">
        {leftButton && (
          <ButtonComponent 
            variant={leftButton.variant} 
            onClick={leftButton.onClick}
          >
            {leftButton.text}
          </ButtonComponent>
        )}
      </div>
      
      <div className="flex items-center gap-3 max-sm:w-full max-sm:flex-col">
        {rightButtons.map((button, index) => (
          <ButtonComponent
            key={`${button.text}-${index}`}
            variant={button.variant}
            onClick={button.onClick}
          >
            {button.text}
          </ButtonComponent>
        ))}
      </div>
    </div>
  );
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  buttons,
  onClose,
  ButtonComponent = Button,
}) => {

  const { handleBackdropClick } = useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] animate-fade-in cursor-pointer"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      data-testid="modal-backdrop"
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-[90%] max-h-[90vh] overflow-hidden animate-slide-in cursor-default"
        data-testid="modal-content"
      >
        <ModalHeader title={title} onClose={onClose} />
        <ModalContent message={message} />
        <ModalFooter buttons={buttons} ButtonComponent={ButtonComponent} />
      </div>
    </div>
  );
};