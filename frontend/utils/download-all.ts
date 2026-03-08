import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const handleDownloadAll = async () => {
  //@ts-ignore
  if (!data || data.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('documents');

  //@ts-ignore
  for (const doc of data) {
    try {
      const response = await fetch(doc.documentUrl);
      const blob = await response.blob();
      folder?.file(doc.title, blob);
    } catch (error) {
      console.error(`Failed to fetch ${doc.title}:`, error);
    }
  }

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'all-documents.zip');
  });
};
