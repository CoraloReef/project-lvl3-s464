const renderRss = (rssData) => {
  const {
    link,
    itemTitle,
    itemDescription,
  } = rssData;
  return `
        <div class="card mb-2">
          <div class="card-body">
            <h5 class="card-title"><a href="${link}">${itemTitle}</a></h5>
            <p class="card-text">${itemDescription}</p>
          </div>
        </div>`;
};

export default (rss) => {
  const rssDiv = document.querySelector('#rss-list');
  rssDiv.innerHTML = rss.map(rssItems => rssItems.map(item => renderRss(item)).join(''));
};
