import { PageHeader } from '../../components/PageHeader';
import { PlaceholderPanel } from '../../components/PlaceholderPanel';

const boards = ['Free Board', 'Questions', 'Announcements', 'Anonymous Board'];

export function CommunityPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Community"
        title="A disciplined board system for discussion, questions, and announcements."
        description="Posts will support comments, nested replies, likes, bookmarks, reports, editing, deletion, pagination, and search."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {boards.map((board) => (
          <PlaceholderPanel key={board} title={board}>
            Placeholder board feed with future pagination, moderation, and post actions.
          </PlaceholderPanel>
        ))}
      </div>
    </div>
  );
}
