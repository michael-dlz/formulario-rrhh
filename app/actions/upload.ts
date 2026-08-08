"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadFileToCloudinaryAction(
  base64Data: string,
  folder: string = "formulario_rrhh",
  publicId?: string
) {
  if (!base64Data) {
    return { success: false, error: "No se proporcionó ningún archivo." };
  }

  try {
    const isPdf = base64Data.startsWith("data:application/pdf");
    const isRaw = isPdf || (!base64Data.startsWith("data:image/"));

    const options: any = {
      folder: `rrhh/${folder}`,
      resource_type: isRaw ? "raw" : "image",
      type: "upload",
      access_mode: "public",
      overwrite: true,
      invalidate: true,
    };

    if (publicId) {
      options.public_id = isPdf && !publicId.endsWith(".pdf") ? `${publicId}.pdf` : publicId;
    }

    const uploadRes = await cloudinary.uploader.upload(base64Data, options);

    return {
      success: true,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      format: uploadRes.format,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al subir archivo a Cloudinary.";
    console.error("Error en Cloudinary Upload:", err);
    return { success: false, error: msg };
  }
}
