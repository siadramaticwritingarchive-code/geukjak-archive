import { PageHeader } from '../../components/PageHeader';
import { PlaceholderPanel } from '../../components/PlaceholderPanel';

export function ProfilePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Member Space"
        title="Profile"
        description="Authenticated users will manage profile details, saved works, bookmarks, and community activity here."
      />
      <PlaceholderPanel title="Profile Placeholder">
        Profile data and account actions will render here after auth state management is introduced.
      </PlaceholderPanel>
    </div>
  );
}
