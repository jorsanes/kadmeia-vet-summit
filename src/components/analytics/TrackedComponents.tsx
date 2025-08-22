import React from 'react';
import { usePlausible } from '@/hooks/usePlausible';
import { addUTMToUrl, UTMParams } from '@/lib/analytics';

interface TrackedLinkProps {
  href: string;
  children: React.ReactNode;
  eventName?: string;
  eventProps?: Record<string, any>;
  utmParams?: UTMParams;
  className?: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

/**
 * Link component that automatically tracks clicks and adds UTM parameters
 */
export function TrackedLink({
  href,
  children,
  eventName = 'Link Click',
  eventProps = {},
  utmParams,
  className,
  target,
  rel,
  'aria-label': ariaLabel,
  ...props
}: TrackedLinkProps) {
  const { trackEvent } = usePlausible();

  const handleClick = () => {
    // Track the click event
    trackEvent(eventName, {
      url: href,
      ...eventProps
    });
  };

  // Add UTM parameters if provided
  const finalHref = utmParams ? addUTMToUrl(href, utmParams) : href;

  return (
    <a
      href={finalHref}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </a>
  );
}

interface TrackedButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  eventName?: string;
  eventProps?: Record<string, any>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

/**
 * Button component that automatically tracks clicks
 */
export function TrackedButton({
  onClick,
  children,
  eventName = 'Button Click',
  eventProps = {},
  className,
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
  ...props
}: TrackedButtonProps) {
  const { trackEvent } = usePlausible();

  const handleClick = () => {
    // Track the click event
    trackEvent(eventName, eventProps);
    
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}