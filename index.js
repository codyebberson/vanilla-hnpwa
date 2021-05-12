
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js').then(function (registration) {
    console.log('Registered events at scope: ', registration.scope);
  });
}

const root = document.getElementById('app');
const baseUrl = 'https://api.hnpwa.com/v0/';
var folder = '';
var id = 1;

const escapeHtml = (unsafe) => unsafe
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const html = (...rest) => rest
  .flat(Infinity)
  .filter(x => !!x)
  .map(str => str.startsWith('<') ? str : escapeHtml(str))
  .join('');

const loadHash = () => {
  const q = window.location.hash.replace('#', '').split('/');
  folder = q[0] || 'news';
  id = q[1] || 1;

  fetch(baseUrl + folder + '/' + id + '.json')
    .then(response => response.json())
    .then(data => {
      root.innerHTML = Array.isArray(data) ? renderList(data) : renderItem(data);
      window.scrollTo(0, 0);
    });
};

const renderList = (items) => html(
  '<ol start="' + ((id - 1) * 30 + 1) + '">',
  items.map(item => html(
    '<li>',
    '<a href="' + item.url + '">',
    item.title,
    '</a>',
    '<div>',
    item.points + ' points by ' + item.user + ' | ',
    '<a href="#item/' + item.id + '">',
    item.comments_count + ' comments',
    '</a>',
    '</div>',
    '</li>'
  )),
  id > 1 && '<a href="#' + folder + '/' + (id - 1) + '">Prev</a> ',
  items.length >= 30 && '<a href="#' + folder + '/' + (id + 1) + '">Next</a>',
  '</ol>');

const renderItem = (item) => html(
  '<div>',
  '<strong>',
  item.title,
  '</strong>',
  '<div>',
  item.points + ' points by ' + item.user + ' | ',
  '<a href="#item/' + item.id + '">' + item.comments_count + ' comments</a>',
  '</div>',
  renderComments(item.comments),
  '</div>');

const renderComments = (comments) => html(
  '<div>',
  comments.map(comment => html(
    '<hr>',
    '<div>',
    '<div>',
    comment.user + ' ' + comment.time_ago,
    '</div>',
    '<div>',
    comment.content,
    '</div>',
    comment.comments && [
      '<blockquote>',
      renderComments(comment.comments),
      '</blockquote>'
    ],
    '</div>'
  )),
  '</div>');

window.addEventListener('load', loadHash);
window.addEventListener('hashchange', loadHash);
