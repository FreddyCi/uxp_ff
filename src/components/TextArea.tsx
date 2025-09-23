import React from "react";
import { useTextField } from "react-aria";
import { useRef } from "react";
import "./TextArea-hybrid.css";

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  size?: "s" | "m" | "l";
  isQuiet?: boolean;
  name?: string;
  id?: string;
  description?: string;
  errorMessage?: string;
  validationState?: "valid" | "invalid";
  className?: string;
  style?: React.CSSProperties;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  rows = 4,
  cols,
  resize = "vertical",
  size = "m",
  isQuiet = false,
  name,
  id,
  description,
  errorMessage,
  validationState,
  className = "",
  style,
  ...props
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  
  // React Aria's useTextField hook supports multiline
  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
    {
      label,
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      isRequired,
      isDisabled,
      validationState: isInvalid ? "invalid" : validationState,
      name,
      id,
      description,
      errorMessage,
      inputElementType: "textarea",
      ...props,
    },
    ref
  );

  // Build CSS classes using EXACTLY the same pattern as TextField
  const sizeClass = size !== "m" ? `spectrum-Textfield--size${size.toUpperCase()}` : "";
  const quietClass = isQuiet ? "spectrum-Textfield--quiet" : "";
  
  const nuclearDivClasses = [
    "uxp-reset--complete",
    "spectrum-Textfield",
    "spectrum-Textfield", // Double class for ultra-high specificity
    sizeClass,
    quietClass,
    className
  ].filter(Boolean).join(" ");

  const labelClasses = [
    "spectrum-FieldLabel",
    `spectrum-FieldLabel--size${size.toUpperCase()}`,
    `spectrum-FieldLabel--size${size.toUpperCase()}` // Double for specificity
  ].filter(Boolean).join(" ");

  const helpTextClasses = [
    "spectrum-HelpText",
    `spectrum-HelpText--size${size.toUpperCase()}`,
    `spectrum-HelpText--size${size.toUpperCase()}`, // Double for specificity
    isInvalid || validationState === "invalid" ? "spectrum-HelpText--negative" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className="textarea-container" style={style}>
      {label && (
        <label {...labelProps} className={labelClasses}>
          {label}
          {isRequired && <span className="spectrum-FieldLabel-requiredIcon"> *</span>}
        </label>
      )}
      
      {/* NUCLEAR DIV APPROACH - Exactly like TextField but for textarea */}
      <div
        role="textbox"
        className={nuclearDivClasses}
        aria-disabled={isDisabled}
        aria-invalid={isInvalid || validationState === "invalid"}
        style={{
          resize: resize,
          minHeight: rows ? `${rows * 1.5}em` : undefined,
        }}
      >
        <textarea
          {...inputProps}
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
          style={{
            resize: resize,
          }}
        />
      </div>

      {/* Help text or error message */}
      {(description || errorMessage) && (
        <div
          {...(isInvalid || validationState === "invalid" ? errorMessageProps : descriptionProps)}
          className={helpTextClasses}
        >
          {isInvalid || validationState === "invalid" ? errorMessage : description}
        </div>
      )}
    </div>
  );
};
