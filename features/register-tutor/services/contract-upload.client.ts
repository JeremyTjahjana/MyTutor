import { supabase } from "@/lib/supabase/client";

export type UploadedContract = {
  fileName: string;
  publicUrl: string;
};

export async function uploadTutorContractPdf(
  userId: string,
  file: File,
): Promise<UploadedContract> {
  const fileExt = file.name.split(".").pop() || "pdf";
  const storagePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("tutor-contracts")
    .upload(storagePath, file, {
      contentType: file.type || "application/pdf",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("tutor-contracts").getPublicUrl(storagePath);

  return {
    fileName: file.name,
    publicUrl,
  };
}
