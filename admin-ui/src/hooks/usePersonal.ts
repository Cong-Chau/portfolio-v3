import { useCallback, useEffect, useState } from "react";
import { personalService } from "../services/personalService";
import { useToast } from "../context/ToastContext";
import type { PersonalInfoRequest } from "../types/api";

export function usePersonal() {
  const { addToast } = useToast();
  const [data, setData] = useState<PersonalInfoRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await personalService.get();
      setData(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không tải được dữ liệu";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const save = async (payload: PersonalInfoRequest) => {
    setSaving(true);
    try {
      await personalService.update(payload);
      setData(payload);
      addToast("Đã lưu thông tin cá nhân thành công", "success");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lưu thất bại";
      addToast(msg, "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { data, loading, saving, error, save, refetch: fetch };
}
