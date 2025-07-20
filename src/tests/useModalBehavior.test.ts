import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useModalBehavior } from '../hooks/useModalBehavior';

describe('useModalBehavior', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  it('should handle escape key when modal is open', () => {
    renderHook(() => useModalBehavior(true, mockOnClose));
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not handle escape key when modal is closed', () => {
    renderHook(() => useModalBehavior(false, mockOnClose));
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should set body overflow to hidden when modal opens', () => {
    renderHook(() => useModalBehavior(true, mockOnClose));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when modal closes', () => {
    const { rerender } = renderHook(
      ({ isOpen }) => useModalBehavior(isOpen, mockOnClose),
      { initialProps: { isOpen: true } }
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender({ isOpen: false });
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should handle backdrop click correctly', () => {
    const { result } = renderHook(() => useModalBehavior(true, mockOnClose));
    
    const mockEvent = {
      target: document.createElement('div'),
      currentTarget: null as any,
    };
    mockEvent.currentTarget = mockEvent.target;
    
    result.current.handleBackdropClick(mockEvent as any);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking inside modal content', () => {
    const { result } = renderHook(() => useModalBehavior(true, mockOnClose));
    
    const mockEvent = {
      target: document.createElement('span'),
      currentTarget: document.createElement('div'),
    };
    
    result.current.handleBackdropClick(mockEvent as any);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});