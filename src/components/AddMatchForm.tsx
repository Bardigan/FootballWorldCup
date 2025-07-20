import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useFormValidation } from '../hooks/useFormValidation';

interface AddMatchFormProps {
  onAddMatch: (homeTeam: string, awayTeam: string) => void;
}

interface FormData {
  homeTeam: string;
  awayTeam: string;
}

export const AddMatchForm: React.FC<AddMatchFormProps> = ({ onAddMatch }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
  } = useFormValidation<FormData>({
    initialValues: { homeTeam: '', awayTeam: '' },
    validationRules: [
      {
        field: 'homeTeam',
        validator: (value, allValues) => {
          if (!value.trim()) return 'Home team name is required';
          if (value.trim().length < 2) return 'Home team name must be at least 2 characters';
          if (allValues.awayTeam && value.trim().toLowerCase() === allValues.awayTeam.trim().toLowerCase()) {
            return 'Teams must be different';
          }
          return undefined;
        },
        dependencies: ['awayTeam'],
      },
      {
        field: 'awayTeam',
        validator: (value, allValues) => {
          if (!value.trim()) return 'Away team name is required';
          if (value.trim().length < 2) return 'Away team name must be at least 2 characters';
          if (allValues.homeTeam && value.trim().toLowerCase() === allValues.homeTeam.trim().toLowerCase()) {
            return 'Teams must be different';
          }
          return undefined;
        },
        dependencies: ['homeTeam'],
      },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAll()) {
      onAddMatch(values.homeTeam.trim(), values.awayTeam.trim());
      reset();
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start New Match
        </Button>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '');
  const hasRequiredFields = values.homeTeam.trim().length >= 2 && values.awayTeam.trim().length >= 2;
  const isFormValid = !hasErrors && hasRequiredFields;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Add New Match</h2>
        <Button
          onClick={handleCancel}
          variant="secondary"
          size="sm"
          className="bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-none p-2 text-2xl leading-none min-w-0 w-8 h-8"
          aria-label="Close form"
        >
          ×
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Add match form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="homeTeam"
            label="Home Team"
            value={values.homeTeam}
            onChange={(e) => setValue('homeTeam', e.target.value)}
            onBlur={() => setFieldTouched('homeTeam')}
            placeholder="Enter home team name"
            error={errors.homeTeam}
            touched={touched.homeTeam}
            required
            autoFocus
            autoComplete="off"
          />

          <Input
            id="awayTeam"
            label="Away Team"
            value={values.awayTeam}
            onChange={(e) => setValue('awayTeam', e.target.value)}
            onBlur={() => setFieldTouched('awayTeam')}
            placeholder="Enter away team name"
            error={errors.awayTeam}
            touched={touched.awayTeam}
            required
            autoComplete="off"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={!isFormValid}
            title={!isFormValid ? "Please complete all required fields" : ""}
          >
            Start Match
          </Button>
        </div>
      </form>
    </div>
  );
};
