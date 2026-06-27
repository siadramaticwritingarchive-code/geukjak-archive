import { PageHeader } from '../../components/PageHeader';
import { PlaceholderPanel } from '../../components/PlaceholderPanel';

const adminAreas = [
  'Works',
  'Community',
  'Users',
  'Reports',
  'Storage',
  'Statistics'
];

export function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Dashboard"
        description="Administrators will manage works, users, reports, uploads, announcements, recommended works, and dashboard statistics."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminAreas.map((area) => (
          <PlaceholderPanel key={area} title={area}>
            Placeholder management surface for {area.toLowerCase()}.
          </PlaceholderPanel>
        ))}
      </div>
    </div>
  );
}
