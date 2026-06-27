import { cn } from '../../utils/cn';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea
        className={cn(
          'mt-2 min-h-32 w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}
