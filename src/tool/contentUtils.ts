import path from "path";

export const decodeHtmlEntities = (content: string): string => {
  return content
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
};

export const shouldDecodeHtml = (filePath: string): boolean => {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".html" || ext === ".htm";
};
