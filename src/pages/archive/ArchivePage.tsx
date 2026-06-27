import { Link } from 'react-router';
import { PageHeader } from '../../components/PageHeader';
import { PlaceholderPanel } from '../../components/PlaceholderPanel';

const sampleWorks = [
  'The Gold Curtain',
  'Black Box Letters',
  'Ivory Rehearsals'
];

export function ArchivePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Archive"
        title="Browse plays with search, filters, bookmarks, likes, and controlled PDF access."
        description="The production archive will organize works by author, year, genre, synopsis, poster, tags, views, and engagement signals."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {sampleWorks.map((title, index) => (
          <Link key={title} to={`/archive/${index + 1}`}>
            <PlaceholderPanel title={title}>
              Placeholder work card with future poster, author, genre, year, tags, and archive actions.
            </PlaceholderPanel>
          </Link>
        ))}
      </div>
    </div>
  );
}
