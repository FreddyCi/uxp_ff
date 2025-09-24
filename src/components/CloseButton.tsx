import { useButton, useHover } from 'react-aria';
import type { AriaButtonProps } from 'react-aria';
import { useMemo, useRef } from 'react';
import './CloseButton-hybrid.css';

type CloseButtonSize = 'small' | 'medium' | 'large' | 'extraLarge';
type CrossIconVariant = 'Cross75' | 'Cross100' | 'Cross200' | 'Cross300' | 'Cross400' | 'Cross500' | 'Cross600';

interface CloseButtonProps extends Omit<AriaButtonProps<'div'>, 'children'> {
  size?: CloseButtonSize;
  iconVariant?: CrossIconVariant;
  className?: string;
}

type IconData = {
  viewBox: string;
  path: string;
};

const ICON_PATHS: Record<CrossIconVariant, IconData> = {
  Cross75: {
    viewBox: '0 0 8 8',
    path: 'M5.188 4l2.14-2.14A.84.84 0 106.141.672L4 2.812 1.86.672A.84.84 0 00.672 1.86L2.812 4 .672 6.14A.84.84 0 101.86 7.328L4 5.188l2.14 2.14A.84.84 0 107.328 6.14z',
  },
  Cross100: {
    viewBox: '0 0 8 8',
    path: 'M5.238 4l2.456-2.457A.875.875 0 106.456.306L4 2.763 1.543.306A.875.875 0 00.306 1.544L2.763 4 .306 6.457a.875.875 0 101.238 1.237L4 5.237l2.456 2.457a.875.875 0 101.238-1.237z',
  },
  Cross200: {
    viewBox: '0 0 10 10',
    path: 'M6.29 5l2.922-2.922a.911.911 0 00-1.29-1.29L5 3.712 2.078.789a.911.911 0 00-1.29 1.289L3.712 5 .79 7.922a.911.911 0 101.289 1.29L5 6.288 7.923 9.21a.911.911 0 001.289-1.289z',
  },
  Cross300: {
    viewBox: '0 0 12 12',
    path: 'M7.344 6l3.395-3.396a.95.95 0 00-1.344-1.342L6 4.657 2.604 1.262a.95.95 0 00-1.342 1.342L4.657 6 1.262 9.396a.95.95 0 001.343 1.343L6 7.344l3.395 3.395a.95.95 0 001.344-1.344z',
  },
  Cross400: {
    viewBox: '0 0 12 12',
    path: 'M7.398 6l3.932-3.932A.989.989 0 009.932.67L6 4.602 2.068.67A.989.989 0 00.67 2.068L4.602 6 .67 9.932a.989.989 0 101.398 1.398L6 7.398l3.932 3.932a.989.989 0 001.398-1.398z',
  },
  Cross500: {
    viewBox: '0 0 14 14',
    path: 'M8.457 7l4.54-4.54a1.03 1.03 0 00-1.458-1.456L7 5.543l-4.54-4.54a1.03 1.03 0 00-1.457 1.458L5.543 7l-4.54 4.54a1.03 1.03 0 101.457 1.456L7 8.457l4.54 4.54a1.03 1.03 0 001.456-1.458z',
  },
  Cross600: {
    viewBox: '0 0 16 16',
    path: 'M9.518 8l5.23-5.228a1.073 1.073 0 00-1.518-1.518L8.001 6.483l-5.229-5.23a1.073 1.073 0 00-1.518 1.519L6.483 8l-5.23 5.229a1.073 1.073 0 101.518 1.518l5.23-5.23 5.228 5.23a1.073 1.073 0 001.518-1.518z',
  },
};

const SIZE_CLASS_MAP: Record<CloseButtonSize, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
  extraLarge: 'XL',
};

const ICON_SIZE_CLASS_MAP: Record<CloseButtonSize, string> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  extraLarge: 'large',
};

const DEFAULT_ICON_BY_SIZE: Record<CloseButtonSize, CrossIconVariant> = {
  small: 'Cross75',
  medium: 'Cross100',
  large: 'Cross300',
  extraLarge: 'Cross300',
};

export function CloseButton({
  size = 'medium',
  iconVariant,
  className = '',
  isDisabled,
  onPress,
  ...props
}: CloseButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const effectiveIcon = iconVariant ?? DEFAULT_ICON_BY_SIZE[size];
  const iconData = useMemo<IconData>(() => ICON_PATHS[effectiveIcon] ?? ICON_PATHS.Cross100, [effectiveIcon]);

  const ariaLabel = (props['aria-label'] ?? 'Close') as string;

  const { buttonProps } = useButton(
    {
      ...props,
      onPress,
      isDisabled,
      elementType: 'div',
      'aria-label': ariaLabel,
    } as AriaButtonProps<'div'> & { elementType: 'div' },
    ref
  );

  const { hoverProps } = useHover({ isDisabled });

  const combinedClassName = [
    'uxp-reset--complete',
    'spectrum-CloseButton',
    `spectrum-CloseButton--size${SIZE_CLASS_MAP[size]}`,
    buttonProps.className,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconClassName = [
    'spectrum-Icon',
    `spectrum-Icon--${ICON_SIZE_CLASS_MAP[size]}`,
    'spectrum-CloseButton-UIIcon',
    `spectrum-UIIcon-${effectiveIcon}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...buttonProps}
      {...hoverProps}
      ref={ref}
      className={combinedClassName}
      data-icon={effectiveIcon}
      data-size={size}
    >
      <svg
        className={iconClassName}
        viewBox={iconData.viewBox}
        aria-hidden="true"
        focusable="false"
      >
        <path d={iconData.path} fill="currentColor" />
      </svg>
    </div>
  );
}

export default CloseButton;
