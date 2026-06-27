import { PageHeader } from '../../components/PageHeader';
import { PlaceholderPanel } from '../../components/PlaceholderPanel';

export function LoginPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Authentication"
        title="Login"
        description="Email login and password reset will be implemented with Supabase Auth, React Hook Form, and Zod."
      />
      <PlaceholderPanel title="Login Form Placeholder">
        Form fields, validation, loading states, and auth error handling will be added in the authentication feature step.
      </PlaceholderPanel>
    </div>
  );
}
