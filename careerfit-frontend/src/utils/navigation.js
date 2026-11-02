export function scrollToHomeHeroIfCurrentPage(event) {
  if (window.location.pathname !== '/') return;

  const hero = document.getElementById('home-hero');
  if (!hero) return;

  event.preventDefault();
  hero.scrollIntoView({ block: 'start' });
}
