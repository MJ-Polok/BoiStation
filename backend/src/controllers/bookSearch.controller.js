import { asyncHandler } from "../utils/asyncHandler.js";

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
const OPEN_LIBRARY_COVERS_URL = "https://covers.openlibrary.org";
const USER_AGENT = "BoiStation/0.1 (book discovery for Bangladesh readers)";

function getCoverUrl(coverId, size = "L") {
  if (!coverId) return undefined;
  return `${OPEN_LIBRARY_COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

function getDescriptionText(description) {
  if (!description) return "";
  if (typeof description === "string") return description;
  return description.value || "";
}

function normalizeSearchDoc(doc) {
  const sourceId = doc.key?.replace("/works/", "") || doc.edition_key?.[0];

  return {
    source: "open-library",
    sourceId,
    title: doc.title,
    author: doc.author_name?.[0] || "Unknown author",
    publisherYear: doc.first_publish_year ? String(doc.first_publish_year) : "Open Library",
    coverUrl: getCoverUrl(doc.cover_i),
    description: "",
    openLibraryKey: doc.key,
    isbn: doc.isbn?.[0],
  };
}

async function fetchOpenLibraryJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Open Library request failed with ${response.status}`);
  }

  return response.json();
}

export const searchOfficialBooks = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim();
  const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 10);

  if (!query) {
    res.status(400);
    throw new Error("Search query is required");
  }

  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    fields: "key,title,author_name,first_publish_year,cover_i,isbn,edition_key",
  });

  const result = await fetchOpenLibraryJson(`${OPEN_LIBRARY_BASE_URL}/search.json?${params.toString()}`);
  const books = (result.docs || [])
    .map(normalizeSearchDoc)
    .filter((book) => book.sourceId && book.title)
    .slice(0, limit);

  res.json({
    success: true,
    data: books,
  });
});

export const getOfficialBook = asyncHandler(async (req, res) => {
  const sourceId = req.params.sourceId?.trim();

  if (!sourceId) {
    res.status(400);
    throw new Error("Source id is required");
  }

  const workId = sourceId.startsWith("OL") ? sourceId : sourceId.replace("/works/", "");
  const work = await fetchOpenLibraryJson(`${OPEN_LIBRARY_BASE_URL}/works/${workId}.json`);
  const authorKey = work.authors?.[0]?.author?.key;
  let author = "Unknown author";

  if (authorKey) {
    try {
      const authorResult = await fetchOpenLibraryJson(`${OPEN_LIBRARY_BASE_URL}${authorKey}.json`);
      author = authorResult.name || author;
    } catch {
      author = "Unknown author";
    }
  }

  res.json({
    success: true,
    data: {
      source: "open-library",
      sourceId: workId,
      title: work.title,
      author,
      publisherYear: work.first_publish_date || "Open Library",
      coverUrl: getCoverUrl(work.covers?.[0]),
      description: getDescriptionText(work.description),
      openLibraryKey: work.key,
    },
  });
});
