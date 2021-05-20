import React from 'react';
import styled from 'styled-components';

const StyledFormField = styled.div.attrs({ className: 'form-field' })`
  display: flex;
  flex-direction: column;

  width: 85%;
  margin: 0 auto;

  > label {
    font-size: 2rem;
  }

  > input {
    font-size: 2rem;

    &.invalid {
      border-color: red;
    }
  }

  > .input-error {
    color: red;
    font-size: 1.2rem;
    min-height: 1.7rem;
  }
`;

export interface FormFieldProps {
  name: string;
  label: string;
  type: 'text' | 'number';
  value: string | number;
  min?: number;
  max?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  isTouched: boolean;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  value,
  min,
  max,
  error,
  onChange,
  onBlur,
  isTouched,
}) => {
  return (
    <StyledFormField>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        min={min}
        max={max}
        className={isTouched && error ? 'invalid' : ''}
        onChange={onChange}
        onBlur={onBlur}
      />
      {<div className="input-error">{isTouched && error}</div>}
    </StyledFormField>
  );
};

export default FormField;
