import { PageHeader } from '../../components/PageHeader';
import { PlaceholderPanel } from '../../components/PlaceholderPanel';

export function SignupPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Authentication"
        title="Signup"
        description="Email signup will be wired to Supabase Auth after the architecture baseline is approved."
      />
      <PlaceholderPanel title="Signup Form Placeholder">
        Account creation, profile bootstrap, validation, and confirmation states will be added later.
      </PlaceholderPanel>
    </div>
  );
}
