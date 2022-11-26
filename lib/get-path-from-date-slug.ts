export function getPathFromDateSlug(date, slug) {
  const postDate = new Date(date);
  const month = (postDate.getMonth() + 1).toString().padStart(2, "0");
  const year = postDate.getFullYear().toString();
  return `/${year}/${month}/${slug}`;
}
