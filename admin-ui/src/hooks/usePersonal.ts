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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetch();
  }, [fetch]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await personalService.get();
        if (!ignore) {
          setData(res);
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : "Không tải được dữ liệu";
          setError(msg);
          addToast(msg, "error");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [addToast]);

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

  return { data, loading, saving, error, save, refetch };
}
