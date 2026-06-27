import { PageHeader } from '../components/PageHeader';
import { PlaceholderPanel } from '../components/PlaceholderPanel';

export function HomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Department Archive"
        title="A living stage for scripts, voices, and student theatre history."
        description="This foundation will become the production archive for the Department of Playwriting at Seoul Institute of the Arts."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <PlaceholderPanel title="Recommended Works">
          Curated works will appear here once archive data and admin controls are connected.
        </PlaceholderPanel>
        <PlaceholderPanel title="Recent Discussions">
          Community activity, announcements, and questions will be summarized here.
        </PlaceholderPanel>
        <PlaceholderPanel title="Archive Signals">
          Views, likes, bookmarks, and featured collections will be surfaced here.
        </PlaceholderPanel>
      </div>
    </div>
  );
}
