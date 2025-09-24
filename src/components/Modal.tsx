import { ReactNode, useEffect, useId, HTMLAttributes, useMemo } from 'react';
import { Button } from './Button';
import { CloseButton } from './CloseButton';
import './Modal-hybrid.css';

type ModalActionVariant = 'accent' | 'primary' | 'secondary' | 'negative';
type ModalActionTreatment = 'fill' | 'outline';

export interface ModalAction {
  label: string;
  onPress?: () => void;
  variant?: ModalActionVariant;
  treatment?: ModalActionTreatment;
  isDisabled?: boolean;
}

export interface ModalProps {
  id?: string;
  isOpen: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  isDismissable?: boolean;
  showUnderlay?: boolean;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  onClose?: () => void;
  onConfirm?: () => void;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  className?: string;
  wrapperClassName?: string;
  footerContent?: ReactNode;
}

export function Modal({
  id,
  isOpen,
  title,
  description,
  children,
  isDismissable = true,
  showUnderlay = true,
  primaryAction,
  secondaryAction,
  onClose,
  onConfirm,
  wrapperProps,
  className = '',
  wrapperClassName = '',
  footerContent,
}: ModalProps) {
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const ariaLabelledBy = useMemo(() => (title ? headingId : undefined), [title, headingId]);
  const ariaDescribedBy = useMemo(() => {
    if (children) return descriptionId;
    if (description) return descriptionId;
    return undefined;
  }, [children, description, descriptionId]);

  const wrapperClasses = [
    'uxp-reset--complete',
    'spectrum-Modal-wrapper',
    isOpen ? 'is-open' : '',
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const modalClasses = [
    'uxp-reset--complete',
    'spectrum-Modal',
    'spectrum-Modal--responsive',
    isOpen ? 'is-open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const underlayClasses = [
    'uxp-reset--complete',
    'spectrum-Underlay',
    isOpen ? 'is-open' : '',
  ].join(' ');

  if (!isOpen && !showUnderlay) {
    return null;
  }

  return (
    <>
      {showUnderlay && (
        <div
          data-uxp-modal-underlay
          className={underlayClasses}
          aria-hidden="true"
          onClick={() => onClose?.()}
        />
      )}

      <div
        {...wrapperProps}
        data-uxp-modal-wrapper
        className={wrapperClasses}
        role="presentation"
      >
        <div
          id={id}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className={modalClasses}
          tabIndex={-1}
        >
          {(title || isDismissable) && (
            <div className="spectrum-Modal-header">
              {title && (
                <h2 id={headingId} className="spectrum-Modal-headerTitle">
                  {title}
                </h2>
              )}

              {isDismissable && (
                <CloseButton
                  aria-label="Close modal"
                  className="spectrum-Modal-closeButton"
                  size="small"
                  onPress={() => onClose?.()}
                />
              )}
            </div>
          )}

          {(description || children) && (
            <div id={descriptionId} className="spectrum-Modal-content">
              {description && <p className="spectrum-Modal-description">{description}</p>}
              {children}
            </div>
          )}

          {(primaryAction || secondaryAction || footerContent) && (
            <div className="spectrum-Modal-footer">
              {footerContent}

              <div className="spectrum-Modal-footerActions">
                {secondaryAction && (
                  <Button
                    variant={secondaryAction.variant ?? 'secondary'}
                    treatment={secondaryAction.treatment ?? 'outline'}
                    size="medium"
                    isDisabled={secondaryAction.isDisabled}
                    onPress={secondaryAction.onPress}
                  >
                    {secondaryAction.label}
                  </Button>
                )}

                {primaryAction && (
                  <Button
                    variant={primaryAction.variant ?? 'accent'}
                    treatment={primaryAction.treatment ?? 'fill'}
                    size="medium"
                    isDisabled={primaryAction.isDisabled}
                    onPress={() => {
                      primaryAction.onPress?.();
                      onConfirm?.();
                    }}
                  >
                    {primaryAction.label}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Modal;
