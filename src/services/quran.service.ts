// Fungsi helper untuk fetch dengan Timeout & Retry
async function fetchWithRetry(
  url: string,
  retries = 3,
  timeout = 5000,
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timer);

      const isLastAttempt = attempt === retries;
      console.warn(`Percobaan ke-${attempt} gagal: ${error.message}`);

      if (isLastAttempt) {
        throw new Error(
          `Gagal mengambil data dari API setelah ${retries} percobaan.`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Pastikan ada kata 'export' di depan fungsi ini
export async function getSurahs() {
  const API_URL = "https://equran.id/api/v2/surat";
  const json = await fetchWithRetry(API_URL, 3, 5000);
  return json.data; // array 114 surah
}

export async function getSurahByNumber(nomor: string | number) {
  const API_URL = `https://equran.id/api/v2/surat/${nomor}`;
  const json = await fetchWithRetry(API_URL, 3, 5000);
  return json.data; // objek satu surah beserta ayat-ayatnya
}
