'use client';
import {
  Button,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagGroupProps as AriaTagGroupProps,
  TagList,
  TagListProps,
  TagProps,
} from 'react-aria-components';
import {Label} from './Form';
import {Text} from './Content';
import './TagGroup.css';

// Simple X icon component since we don't have lucide-react
function XIcon() {
  return (
    <span style={{
      display: 'inline-block',
      width: '12px',
      height: '12px',
      lineHeight: '1',
      fontSize: '10px',
      fontWeight: 'bold'
    }}>
      ×
    </span>
  );
}

export interface TagGroupProps<T>
  extends
    Omit<AriaTagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function TagGroup<T extends object>(
  {
    label,
    description,
    errorMessage,
    items,
    children,
    renderEmptyState,
    ...props
  }: TagGroupProps<T>
) {
  try {
    return (
      <AriaTagGroup {...props}>
        {label && <Label>{label}</Label>}
        <TagList items={items} renderEmptyState={renderEmptyState}>
          {children}
        </TagList>
        {description && <Text slot="description">{description}</Text>}
        {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
      </AriaTagGroup>
    );
  } catch (error) {
    console.error('Error creating TagGroup:', error);
    return (
      <div>
        {label && <div>{label}</div>}
        <div>TagGroup Error</div>
      </div>
    );
  }
}

export function Tag(
  { children, ...props }: Omit<TagProps, 'children'> & {
    children?: React.ReactNode;
  }
) {
  const textValue = typeof children === 'string' ? children : undefined;
  
  try {
    return (
      <AriaTag textValue={textValue} {...props}>
        {({ allowsRemoving }) => {
          try {
            return (
              <>
                {children}
                {allowsRemoving && (
                  <Button slot="remove">
                    <XIcon />
                  </Button>
                )}
              </>
            );
          } catch (error) {
            console.error('Error in Tag render:', error);
            return children;
          }
        }}
      </AriaTag>
    );
  } catch (error) {
    console.error('Error creating Tag:', error);
    return <span>{children}</span>;
  }
}