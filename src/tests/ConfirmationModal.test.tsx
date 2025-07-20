import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ConfirmationModal } from '../components/modal/ConfirmationModal';
import type {  ConfirmationButton } from '../components/modal/ConfirmationModal';

describe('ConfirmationModal', () => {
  const mockOnClose = vi.fn();
  const mockButtonClick = vi.fn();

  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message',
    buttons: [
      { text: 'Cancel', variant: 'secondary' as const, onClick: mockOnClose },
      { text: 'Confirm', variant: 'primary' as const, onClick: mockButtonClick }
    ] as ConfirmationButton[],
    onClose: mockOnClose
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render title and message when open', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when modal content is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const content = screen.getByTestId('modal-content');
    fireEvent.click(content);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render all provided buttons', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should call button onClick when clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should handle empty buttons array', () => {
    render(<ConfirmationModal {...defaultProps} buttons={[]} />);
    expect(screen.queryByRole('button', { name: /cancel|confirm/i })).not.toBeInTheDocument();
  });
});