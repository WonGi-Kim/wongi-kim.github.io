const themeButton = document.querySelector('.theme-button');
const themeLabel = document.querySelector('.theme-label');
let savedTheme;
try { savedTheme = localStorage.getItem('wongi-theme'); } catch { /* Storage can be disabled. */ }

function setTheme(theme) {
  const dark = theme === 'dark';
  document.body.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? '밝은 화면으로 전환' : '어두운 화면으로 전환');
  themeLabel.textContent = dark ? '라이트 모드' : '다크 모드';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#142019' : '#f7f7f2';
}

setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light');
themeButton.addEventListener('click', () => {
  const theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  try { localStorage.setItem('wongi-theme', theme); } catch { /* The theme still changes for this visit. */ }
});

const navigation = [...document.querySelectorAll('.section-nav a')];
const sections = [...document.querySelectorAll('main > section')];
let scheduled = false;
function updateNavigation() {
  const edge = window.innerWidth <= 820 ? 165 : 100;
  const current = sections.filter(section => section.getBoundingClientRect().top <= edge).at(-1) || sections[0];
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
  const id = atBottom ? sections.at(-1).id : current.id;
  navigation.forEach(link => {
    if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
function requestNavigationUpdate() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}
window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
window.addEventListener('resize', requestNavigationUpdate);
updateNavigation();

let openBeforePrint;
window.addEventListener('beforeprint', () => {
  openBeforePrint = [...document.querySelectorAll('details')].map(detail => [detail, detail.open]);
  openBeforePrint.forEach(([detail]) => { detail.open = true; });
});
window.addEventListener('afterprint', () => {
  openBeforePrint?.forEach(([detail, wasOpen]) => { detail.open = wasOpen; });
  openBeforePrint = undefined;
});
document.querySelector('.print-button').addEventListener('click', () => window.print());
