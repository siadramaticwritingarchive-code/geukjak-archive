import { NavLink, Outlet } from 'react-router';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Archive', to: '/archive' },
  { label: 'Community', to: '/community' },
  { label: 'Profile', to: '/profile' },
  { label: 'Admin', to: '/admin' }
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <NavLink to="/" className="group w-fit">
            <span className="block text-xs font-medium uppercase tracking-[0.32em] text-gold">
              Seoul Institute of the Arts
            </span>
            <span className="mt-1 block font-serif text-2xl leading-none">
              Playwriting Archive
            </span>
          </NavLink>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full border px-4 py-2 transition-colors',
                    isActive
                      ? 'border-gold bg-gold text-ink'
                      : 'border-ink/10 text-ink/70 hover:border-ink/30 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              className="rounded-full border border-ink bg-ink px-4 py-2 text-ivory transition-colors hover:bg-charcoal"
            >
              Login
            </NavLink>
          </nav>
        </div>
      </header>

      <motion.main
        className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
