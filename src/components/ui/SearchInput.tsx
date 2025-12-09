import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';
import { cn } from '../../lib/utils';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onSearch: (value: string) => void;
    debounce?: number;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, onSearch, debounce = 500, ...props }, ref) => {
        const [value, setValue] = React.useState(props.value || '');

        React.useEffect(() => {
            const handler = setTimeout(() => {
                onSearch(String(value));
            }, debounce);

            return () => {
                clearTimeout(handler);
            };
        }, [value, debounce, onSearch]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        };

        return (
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    className={cn("pl-9 bg-white", className)}
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                    {...props}
                />
            </div>
        );
    }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
