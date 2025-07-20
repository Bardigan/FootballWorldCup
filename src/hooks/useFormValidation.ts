import { useState, useEffect, useCallback, useMemo } from 'react';

interface ValidationRule<T> {
  field: keyof T;
  validator: (value: any, allValues: T) => string | undefined;
  dependencies?: (keyof T)[];
}

interface UseFormValidationOptions<T> {
  initialValues: T;
  validationRules: ValidationRule<T>[];
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationRules,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const ruleMap = useMemo(() => {
    return new Map(validationRules.map(rule => [rule.field, rule]));
  }, [validationRules]);

  const dependencyMap = useMemo(() => {
    const map = new Map<keyof T, Set<keyof T>>();
    
    validationRules.forEach(rule => {
      const { field, dependencies = [] } = rule;
      dependencies.forEach(dep => {
        if (!map.has(dep)) {
          map.set(dep, new Set());
        }
        map.get(dep)!.add(field);
      });
    });
    
    return map;
  }, [validationRules]);

  const validateField = useCallback((fieldName: keyof T, value: any, allValues: T) => {
    const rule = ruleMap.get(fieldName);
    return rule ? rule.validator(value, allValues) : undefined;
  }, [ruleMap]);

  useEffect(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasChanges = false;

    const fieldsToValidate = new Set<keyof T>();
    
    Object.keys(touched).forEach(field => {
      if (touched[field as keyof T]) {
        fieldsToValidate.add(field as keyof T);
      }
    });

    Object.keys(values).forEach(changedField => {
      const dependentFields = dependencyMap.get(changedField as keyof T);
      if (dependentFields) {
        dependentFields.forEach(field => {
          if (touched[field]) {
            fieldsToValidate.add(field);
          }
        });
      }
    });

    fieldsToValidate.forEach(field => {
      const error = validateField(field, values[field], values);
      if (error !== errors[field]) {
        newErrors[field] = error;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  }, [values, touched, validateField, dependencyMap, errors]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const validateAll = useCallback(() => {
    const allErrors: Partial<Record<keyof T, string>> = {};
    
    validationRules.forEach(rule => {
      const error = validateField(rule.field, values[rule.field], values);
      if (error) {
        allErrors[rule.field] = error;
      }
    });
    
    setErrors(allErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}) as Partial<Record<keyof T, boolean>>
    );
    
    return Object.keys(allErrors).length === 0;
  }, [values, validateField, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid,
  };
}