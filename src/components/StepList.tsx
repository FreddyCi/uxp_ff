import React, { KeyboardEvent, MouseEvent, useMemo } from 'react';
import './StepList-hybrid.css';

export type StepStatus = 'complete' | 'selected' | 'incomplete';

export interface StepItem {
  label: string;
  status?: StepStatus;
  description?: string;
}

export interface StepListProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  currentStep?: number;
  interactive?: boolean;
  isSmall?: boolean;
  onStepChange?: (index: number) => void;
  getStepHref?: (index: number) => string | undefined;
}

function computeStatus(index: number, currentStep: number, explicit?: StepStatus): StepStatus {
  if (explicit) return explicit;
  if (index < currentStep) return 'complete';
  if (index === currentStep) return 'selected';
  return 'incomplete';
}

function buildItemClassName(base: string[], ...conditional: Array<string | false | undefined>) {
  return base.concat(conditional.filter(Boolean) as string[]).join(' ');
}

export const StepList: React.FC<StepListProps> = ({
  steps,
  currentStep = 0,
  interactive = false,
  isSmall = false,
  onStepChange,
  getStepHref,
  className = '',
  ...props
}) => {
  const totalSteps = steps.length;

  const rootClassName = useMemo(() => {
    const classes = [
      'uxp-reset--complete',
      'spectrum-Steplist',
      'spectrum-Steplist',
      interactive ? 'spectrum-Steplist--interactive' : '',
      isSmall ? 'spectrum-Steplist--small' : '',
      className,
    ].filter(Boolean);

    return classes.join(' ');
  }, [interactive, isSmall, className]);

  return (
    <div
      role="list"
      className={rootClassName}
      {...props}
    >
      {steps.map((step, index) => {
        const status = computeStatus(index, currentStep, step.status);
        const isComplete = status === 'complete';
        const isSelected = status === 'selected';
        const itemClasses = buildItemClassName(
          ['spectrum-Steplist-item'],
          isComplete && 'is-complete',
          isSelected && 'is-selected'
        );
        const linkClasses = buildItemClassName(
          ['spectrum-Steplist-link'],
          isComplete && 'is-complete',
          isSelected && 'is-selected'
        );
        const markerClasses = buildItemClassName(
          ['spectrum-Steplist-marker'],
          isComplete && 'is-complete',
          isSelected && 'is-selected'
        );
        const segmentClasses = buildItemClassName(
          ['spectrum-Steplist-segment'],
          isComplete && 'is-complete',
          isSelected && 'is-selected'
        );
        const ariaCurrent: React.AriaAttributes['aria-current'] = isSelected ? 'step' : undefined;
        const href = getStepHref?.(index) ?? '#';
        const isLast = index === totalSteps - 1;

        const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
          if (!interactive) {
            return;
          }
          if (onStepChange) {
            event.preventDefault();
            onStepChange(index);
          }
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
          if (!interactive || !onStepChange) {
            return;
          }
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            onStepChange(index);
          }
        };

        const content = (
          <>
            <span className="spectrum-Steplist-label">{step.label}</span>
            <span className="spectrum-Steplist-markerContainer">
              <span className={markerClasses} aria-hidden="true" />
            </span>
          </>
        );

        return (
          <div
            key={step.label + index}
            role="listitem"
            className={itemClasses}
            aria-posinset={index + 1}
            aria-setsize={totalSteps}
            aria-current={ariaCurrent}
            data-status={status}
          >
            {interactive ? (
              <a
                className={linkClasses}
                role="link"
                tabIndex={isSelected ? 0 : -1}
                aria-current={ariaCurrent}
                href={href}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
              >
                {content}
              </a>
            ) : (
              content
            )}
            {!isLast && <span className={segmentClasses} aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
};

export default StepList;
