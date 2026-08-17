import { useCallback, useEffect, useState } from "react";
import { aboutService } from "../services/aboutService";
import { useToast } from "../context/ToastContext";
import type { AboutDetailRequest, AboutDetailResponse } from "../types/api";

export function useAbout() {
  const { addToast } = useToast();
  const [items, setItems] = useState<AboutDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aboutService.list();
      setItems(data.sort((a, b) => a.orderIndex - b.orderIndex));
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Không tải được dữ liệu",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (payload: AboutDetailRequest) => {
    setSaving(true);
    try {
      await aboutService.create(payload);
      addToast("Đã thêm giới thiệu", "success");
      await fetch();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Thêm thất bại", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: number, payload: AboutDetailRequest) => {
    setSaving(true);
    try {
      await aboutService.update(id, payload);
      addToast("Đã cập nhật", "success");
      await fetch();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Cập nhật thất bại", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await aboutService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      addToast("Đã xóa", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Xóa thất bại", "error");
    }
  };

  const reorder = async (reordered: AboutDetailResponse[]) => {
    setItems(reordered);
    // Update orderIndex sequentially for changed items
    const updates = reordered
      .map((item, idx) => ({ ...item, orderIndex: idx }))
      .filter((item, idx) => items[idx]?.id !== item.id);

    for (const item of updates) {
      try {
        await aboutService.update(item.id, {
          contentVi: item.contentVi,
          contentEn: item.contentEn,
          orderIndex: item.orderIndex,
        });
      } catch {
        // Silently ignore individual failures
      }
    }
  };

  return { items, loading, saving, create, update, remove, reorder, refetch: fetch };
}
