// youtube.ts — YouTube URL parsing utilities.

export function parseYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}
