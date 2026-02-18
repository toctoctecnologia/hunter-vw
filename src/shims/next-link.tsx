// Compatibility shim for next/link -> react-router-dom Link
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import React from 'react';

interface NextLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  children?: React.ReactNode;
}

const Link = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  ({ href, prefetch, scroll, shallow, passHref, legacyBehavior, replace, ...props }, ref) => {
    // If href is external, use a regular anchor tag
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return <a ref={ref} href={href} {...props} />;
    }

    return <RouterLink ref={ref} to={href} replace={replace} {...props} />;
  }
);

Link.displayName = 'Link';

export default Link;
