import memoizee from "memoizee";
const articles = ["and", "but", "or", "for", "nor"];

// We only have an uppercase slug for the `type` property. This shouldn't
// be shown to users. In a prod environment we would likely store a pretty version
// in the DB, here we generate it from the slug
function beautifySlug(slug: string) {
  let words = slug.toLowerCase().split("_");
  return words
    .map((word) => {
      // Caplitalize any word that's not an article
      if (!articles.includes(word)) {
        word = word.slice(0, 1).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}

export default memoizee(beautifySlug);
