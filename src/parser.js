export default (rssUrl) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssUrl, 'application/xml');

  const title = doc.querySelector('title').textContent;
  const items = [...doc.querySelectorAll('item')];
  const rssData = items.map((item) => {
    const link = item.querySelector('link').textContent;
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    return {
      link,
      itemTitle,
      itemDescription,
    };
  });
  return { title, rssData };
};
