import { render, screen, within } from '@testing-library/react';
import App from './App';
import projects from './data/projects';

test('names the site owner in the page h1', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/william trodd/i);
});

test('renders one project row per project', () => {
  render(<App />);
  const work = screen.getByRole('region', { name: /work/i });
  const rows = within(work).getAllByRole('link');
  expect(rows).toHaveLength(projects.length);
});

test('every project row links to its project url', () => {
  render(<App />);
  const work = screen.getByRole('region', { name: /work/i });
  projects.forEach(project => {
    const row = within(work).getByRole('link', { name: new RegExp(project.name, 'i') });
    expect(row).toHaveAttribute('href', project.url);
  });
});

test('every project row lists its tech stack', () => {
  render(<App />);
  const work = screen.getByRole('region', { name: /work/i });
  projects.forEach(project => {
    const row = within(work).getByRole('link', { name: new RegExp(project.name, 'i') });
    project.tech.forEach(tech => {
      expect(within(row).getByText(tech)).toBeInTheDocument();
    });
  });
});

test('nav links point at the sections they name', () => {
  render(<App />);
  const nav = screen.getByRole('navigation');
  ['work', 'about', 'contact'].forEach(label => {
    const link = within(nav).getByRole('link', { name: new RegExp(`^${label}$`, 'i') });
    expect(link).toHaveAttribute('href', `#${label}`);
    // the anchor must resolve to a real element, or the nav is decorative
    expect(document.getElementById(label)).toBeInTheDocument();
  });
});

test('footer offers the github profile as the way to make contact', () => {
  render(<App />);
  const footer = screen.getByRole('contentinfo');
  const github = within(footer).getByRole('link', { name: /github/i });
  expect(github).toHaveAttribute('href', 'https://github.com/WilliamTrodd');
});

test('links that leave the site open safely in a new tab', () => {
  render(<App />);
  screen.getAllByRole('link')
    .filter(link => link.getAttribute('href')?.startsWith('http'))
    .forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    });
});
