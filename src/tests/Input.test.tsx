import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Input } from '../components/ui/Input';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input id="test-input" label="Test Label" />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('renders required asterisk when required prop is true', () => {
    render(<Input id="test-input" label="Required Field" required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
    // Use getByRole to find the textbox
    expect(screen.getByRole('textbox', { name: /Required Field/ })).toBeInTheDocument();
  });

  test('does not render asterisk when required prop is false', () => {
    render(<Input id="test-input" label="Optional Field" />);
    
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  test('shows error message when error and touched are provided', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        error="This field is required" 
        touched={true} 
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('does not show error when error exists but touched is false', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        error="This field is required" 
        touched={false} 
      />
    );
    
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('does not show error when touched is true but no error', () => {
    render(<Input id="test-input" label="Test Field" touched={true} />);
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('applies error styling when error exists and touched', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        error="Error message" 
        touched={true} 
      />
    );
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveClass('border-red-300', 'focus:ring-red-500', 'bg-red-50');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('applies normal styling when no error', () => {
    render(<Input id="test-input" label="Test Field" />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveClass('border-gray-300', 'focus:ring-blue-500');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('renders error icon when error exists and touched', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        error="Error message" 
        touched={true} 
      />
    );
    
    const errorIcons = document.querySelectorAll('svg');
    expect(errorIcons.length).toBeGreaterThan(0);
  });

  test('sets correct aria attributes for accessibility', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        error="Error message" 
        touched={true} 
      />
    );
    
    const input = screen.getByLabelText('Test Field');
    const errorElement = screen.getByRole('alert');
    
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    expect(errorElement).toHaveAttribute('id', 'test-input-error');
    expect(errorElement).toHaveAttribute('aria-live', 'polite');
  });

  test('handles input value changes', () => {
    const handleChange = vi.fn();
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        value="initial" 
        onChange={handleChange} 
      />
    );
    
    const input = screen.getByLabelText('Test Field');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('forwards all input props correctly', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        placeholder="Enter text here"
        type="email"
        disabled
        maxLength={50}
      />
    );
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('maxLength', '50');
  });

  test('applies custom className', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        className="custom-class" 
      />
    );
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveClass('custom-class');
  });

  test('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
    
    const input = screen.getByLabelText('Test Field');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('error message has correct styling classes', () => {
    render(
      <Input 
        id="test-input" 
        label="Test Field" 
        error="Error message" 
        touched={true} 
      />
    );
    
    const errorElement = screen.getByText('Error message');
    expect(errorElement).toHaveClass('mt-1', 'text-sm', 'text-red-600', 'flex', 'items-center', 'gap-1');
  });

  test('label is properly associated with input', () => {
    render(<Input id="test-input" label="Associated Label" />);
    
    const label = screen.getByText('Associated Label');
    const input = screen.getByLabelText('Associated Label');
    
    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });
});