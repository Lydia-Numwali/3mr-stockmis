import { authorizedAPI } from "@/config/axios.config";

export const exportToFile = async (exportUrl: string,filename:string="exportfile"): Promise<void> => {
  const response = await authorizedAPI.get(exportUrl, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  let fileName = `${filename}.xlsx`;
  const contentDisposition = response.headers["content-disposition"];
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+)"?/);
    if (match?.[1]) {
      fileName = match[1];
    }
  }

  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
