import { PageHeader } from '../../components/PageHeader';
import { PlaceholderPanel } from '../../components/PlaceholderPanel';

export function WorkDetailPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Work Detail"
        title="Script metadata, poster, synopsis, engagement, and download permissions."
        description="This page will eventually load a single play by route id and enforce access rules through Supabase policies."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <PlaceholderPanel title="Poster">
          Poster storage preview and upload state will render here.
        </PlaceholderPanel>
        <PlaceholderPanel title="Script Profile">
          Title, author, year, genre, tags, synopsis, view count, likes, bookmarks, and PDF availability will render here.
        </PlaceholderPanel>
      </div>
    </div>
  );
}
