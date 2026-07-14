# Styles

Global styles are loaded once from `app/layout.tsx` in cascade order.

- `foundations.css` — theme tokens, reset, background, and site shell
- `navigation.css` — bottom dock and floating coffee button
- `resume-viewer.css` — in-site PDF viewer window and controls
- `hero.css` — hero, signal animation, shared buttons, headings, and tags
- `skills-experience.css` — skills and experience sections
- `projects.css` — homepage project cards
- `contact.css` — contact section, form, and footer
- `project-detail.css` — project case-study pages and reveal animation
- `responsive.css` — viewport and reduced-motion overrides; keep this last

`globals.css` is intentionally limited to the Tailwind entry directives. Add new rules to the feature file that owns the component instead of growing `globals.css` again.

Shared browser events, such as opening the resume viewer from different sections, live in `app/lib/site-events.js`.
