export async function getAudioDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      resolve(0);
    });
    audio.src = audioUrl;
  });
}

export async function getAudioDurations(
  books: { id: string; audioLink: string }[]
): Promise<Record<string, number>> {
  const results = await Promise.all(
    books.map(async (book) => {
      const duration = await getAudioDuration(book.audioLink);
      return { id: book.id, duration };
    })
  );

  return results.reduce(
    (acc, { id, duration }) => {
      acc[id] = duration;
      return acc;
    },
    {} as Record<string, number>
  );
}