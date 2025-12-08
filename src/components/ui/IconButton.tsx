import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button, ButtonProps } from './Button';

const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, ...props }, ref) => {
        return (
            <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-full", className)}
                ref={ref}
                {...props}
            />
        );
    }
);
IconButton.displayName = 'IconButton';

export { IconButton };
