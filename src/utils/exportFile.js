// utils/downloadFile.js
import {apiInstance} from "./Service"; // adjust path to your apiInstance

export async function downloadFile(endpoint, body = {}, filename = "export.xlsx") {
  try {
    const response = await apiInstance.post(endpoint, body, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const urlObject = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = urlObject;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(urlObject);
  } catch (error) {
    console.error("File download failed:", error);
    throw error;
  }
}
