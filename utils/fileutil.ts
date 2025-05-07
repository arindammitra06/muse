export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Try to extract the extension from the URL
    const urlParts = new URL(url).pathname.split('/');
    const lastSegment = urlParts[urlParts.length - 1];
    const extensionMatch = lastSegment.match(/\.[0-9a-z]+$/i);
    const extension = extensionMatch ? extensionMatch[0] : '';

    // Append extension if not already included
    const finalFilename = filename.endsWith(extension) ? filename : `${filename}${extension}`;

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
}
