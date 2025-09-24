'use client';

import { ReactNode, useMemo, useRef } from 'react';
import { useButton } from 'react-aria';
import CloseButton from './CloseButton';
import './Toast-hybrid.css';

export type ToastVariant = 'neutral' | 'positive' | 'negative' | 'info' | 'warning';

export interface ToastProps {
  /** Controls whether the toast should be rendered. */
  isOpen?: boolean;
  /** Visual style variant aligning with Spectrum CSS modifiers. */
  variant?: ToastVariant;
  /** Primary message for the toast. */
  title?: ReactNode;
  /** Optional supporting details under the title. */
  description?: ReactNode;
  /** Render arbitrary custom content when title/description are not provided. */
  children?: ReactNode;
  /** Label for the optional action button. */
  actionLabel?: string;
  /** Handler invoked when the action button is pressed. */
  onAction?: () => void;
  /** Flag to disable the optional action button. */
  isActionDisabled?: boolean;
  /** Handler invoked when the close affordance is pressed. */
  onClose?: () => void;
  /** Controls whether the close affordance is rendered. */
  isDismissable?: boolean;
  /** Target aria-live politeness level for assistive tech. */
  liveRegion?: 'polite' | 'assertive';
  /** Override the region role used for the toast container. */
  role?: 'status' | 'alert';
  /** Optional id for external anchoring. */
  id?: string;
  /** Additional className hooks, appended to the high-specificity base class list. */
  className?: string;
}

export function Toast({
  isOpen = true,
  variant = 'neutral',
  title,
  description,
  children,
  actionLabel,
  onAction,
  isActionDisabled = false,
  onClose,
  isDismissable = true,
  liveRegion,
  role,
  id,
  className = '',
}: ToastProps) {
  if (!isOpen) {
    return null;
  }

  const computedRole: 'status' | 'alert' = role ?? (variant === 'negative' ? 'alert' : 'status');
  const ariaLive = liveRegion ?? (computedRole === 'alert' ? 'assertive' : 'polite');

  const hasAction = Boolean(actionLabel && onAction);
  const shouldShowClose = isDismissable && typeof onClose === 'function';

  const actionRef = useRef<HTMLDivElement>(null);
  const { buttonProps: actionButtonProps } = useButton(
    {
      onPress: () => {
        if (!isActionDisabled) {
          onAction?.();
        }
      },
      isDisabled: isActionDisabled,
      elementType: 'div',
    },
    actionRef
  );

  const bodyContent = useMemo(() => {
    if (title || description) {
      return (
        <div className="spectrum-Toast-content">
          {title ? <span className="spectrum-Toast-title">{title}</span> : null}
          {description ? <span className="spectrum-Toast-description">{description}</span> : null}
        </div>
      );
    }

    if (children) {
      return <div className="spectrum-Toast-content">{children}</div>;
    }

    return null;
  }, [title, description, children]);

  const containerClassName = [
    'uxp-reset--complete',
    'spectrum-Toast',
    'spectrum-Toast',
    `spectrum-Toast--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      id={id}
      role={computedRole}
      aria-live={ariaLive}
      className={containerClassName}
      data-variant={variant}
    >
      <div className="spectrum-Toast-body">
        {bodyContent}
        {hasAction ? (
          <div
            {...actionButtonProps}
            ref={actionRef}
            role="button"
            tabIndex={isActionDisabled ? -1 : 0}
            className="uxp-reset--complete spectrum-Toast-action spectrum-Toast-action"
            aria-disabled={isActionDisabled || undefined}
          >
            <span className="spectrum-Toast-actionLabel">{actionLabel}</span>
          </div>
        ) : null}
      </div>

      {shouldShowClose ? (
        <div className="spectrum-Toast-buttons">
          <CloseButton
            onPress={onClose}
            size="medium"
            aria-label="Close toast"
            className="spectrum-CloseButton--staticWhite spectrum-Toast-closeButton"
          />
        </div>
      ) : null}
    </div>
  );
}

export default Toast;
