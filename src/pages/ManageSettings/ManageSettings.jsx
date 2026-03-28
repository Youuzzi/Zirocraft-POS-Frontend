import React, { useState, useEffect } from "react";
import { fetchSettings, updateSettings } from "../../Service/SettingService";
import toast from "react-hot-toast";

const ManageSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "",
    defaultFloatAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetchSettings();
      if (res.data) setSettings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal load settings.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pastikan angka dikirim sebagai number, bukan string
      const dataToSave = {
        ...settings,
        defaultFloatAmount: Number(settings.defaultFloatAmount),
      };
      await updateSettings(dataToSave);
      toast.success("Pengaturan Toko Berhasil Diperbarui! 🚀");
    } catch (err) {
      toast.error("Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-container justify-content-center">
      <div
        className="left-column"
        style={{
          maxWidth: "500px",
          border: "1px solid #333",
          background: "#1a1a1a",
        }}
      >
        <h2 className="ziro-title" style={{ color: "#fff" }}>
          Store Settings
        </h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="form-label small fw-bold text-light">
              NAMA TOKO
            </label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              value={settings.storeName}
              onChange={(e) =>
                setSettings({ ...settings, storeName: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-light">
              MODAL LACI (FLOAT)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-info fw-bold">
                Rp
              </span>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={settings.defaultFloatAmount}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultFloatAmount: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-info w-100 fw-bold py-3 shadow"
            disabled={loading}
          >
            {loading ? "PROSES..." : "SIMPAN PERUBAHAN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageSettings;
