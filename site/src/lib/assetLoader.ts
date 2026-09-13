/**
 * Loads the retention point cloud with byte-accurate progress. The loader
 * screen reports this, so nothing here is simulated.
 */

export interface RetentionManifest {
  count: number;
  stride: number;
  scale: number;
  aspect: number;
  totalRetained: number | null;
  regionsPlotted: number;
  top: { name: string; total: number }[];
}

export interface RetentionData {
  manifest: RetentionManifest;
  /** Interleaved [x, y, value] triples, decoded to -1..1 (value 0..1). */
  points: Float32Array;
}

const MANIFEST_URL = '/data/us-retention.json';
const BIN_URL = '/data/us-retention.bin';

/** Manifest is a rounding error next to the binary, so it owns 5% of the bar. */
const MANIFEST_SHARE = 0.05;

async function readWithProgress(
  response: Response,
  onProgress: (fraction: number) => void,
): Promise<ArrayBuffer> {
  const declared = Number(response.headers.get('content-length') ?? 0);
  if (!response.body || declared === 0) {
    onProgress(1);
    return response.arrayBuffer();
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onProgress(Math.min(1, received / declared));
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged.buffer;
}

export async function loadRetentionData(
  onProgress: (fraction: number) => void,
): Promise<RetentionData> {
  const manifestResponse = await fetch(MANIFEST_URL);
  if (!manifestResponse.ok) throw new Error(`manifest ${manifestResponse.status}`);
  const manifest = (await manifestResponse.json()) as RetentionManifest;
  onProgress(MANIFEST_SHARE);

  const binResponse = await fetch(BIN_URL);
  if (!binResponse.ok) throw new Error(`point cloud ${binResponse.status}`);
  const buffer = await readWithProgress(binResponse, (fraction) => {
    onProgress(MANIFEST_SHARE + fraction * (1 - MANIFEST_SHARE));
  });

  const quantised = new Int16Array(buffer);
  const points = new Float32Array(quantised.length);
  const { scale } = manifest;
  for (let i = 0; i < quantised.length; i += 1) {
    points[i] = quantised[i] / scale;
  }

  onProgress(1);
  return { manifest, points };
}

/** Resolves once webfonts are in, so the hero headline never reflows on reveal. */
export async function fontsReady(): Promise<void> {
  if (!('fonts' in document)) return;
  try {
    await document.fonts.ready;
  } catch {
    /* font loading is best-effort */
  }
}
