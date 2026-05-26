// =====================================================
// DATA HISTORY PAGE
// Historical data table with pagination & CSV export
// =====================================================

import { useState, useMemo } from 'react';
import useHistoryData from '../hooks/useHistoryData';
import TopBar from '../components/layout/TopBar';
import { formatTimestamp, formatNumber, formatRupiah } from '../utils/formatters';
import { PLN_TARIFF_PER_KWH } from '../utils/constants';
import {
  MdStorage,
  MdFileDownload,
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
} from 'react-icons/md';
import './DataHistory.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PAGE_SIZE = 15;

export default function DataHistory() {
  const { history, loading } = useHistoryData(200);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Reverse for newest first
  const sortedData = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  // Filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return sortedData;
    const q = searchQuery.toLowerCase();
    return sortedData.filter(
      (item) =>
        (item.timestamp && item.timestamp.toLowerCase().includes(q)) ||
        String(item.voltage).includes(q) ||
        String(item.current).includes(q) ||
        String(item.power).includes(q) ||
        String(item.energy).includes(q) ||
        String(Math.round((item.energy || 0) * PLN_TARIFF_PER_KWH)).includes(q)
    );
  }, [sortedData, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // CSV Export
 const exportExcel = () => {
  const data = sortedData.map((item, index) => ({
    No: index + 1,
    Tanggal: formatTimestamp(item.timestamp),
    'Voltage (V)': formatNumber(item.voltage, 1),
    'Current (A)': formatNumber(item.current, 2),
    'Power (W)': formatNumber(item.power, 0),
    'Energy (kWh)': formatNumber(item.energy, 2),
    'Biaya PLN (Rp)': Math.round((item.energy || 0) * PLN_TARIFF_PER_KWH),
  }));

  // Buat worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Atur lebar kolom
  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 20 },
  ];

  // Buat workbook
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Energy Monitoring'
  );

  // Generate file Excel
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // Simpan file
  const fileData = new Blob(
    [excelBuffer],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    }
  );

  saveAs(
    fileData,
    `energy_data_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

  return (
    <div className="data-history-page">
      <TopBar title="Data" icon={MdStorage} />

      <div className="data-history-content">
        {/* Header Actions */}
        <div className="data-history-actions">
          <div className="data-history-search">
            <MdSearch size={20} />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button className="data-export-btn" onClick={exportExcel}>
            <MdFileDownload size={18} />
            Export Excel
          </button>
        </div>

        {/* Info */}
        <div className="data-history-info">
          <span>Total: <strong>{filteredData.length}</strong> data</span>
          <span>Halaman {currentPage} dari {totalPages}</span>
        </div>

        {/* Table */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Timestamp</th>
                <th>Voltage (V)</th>
                <th>Current (A)</th>
                <th>Power (W)</th>
                <th>Energy (kWh)</th>
                <th className="col-cost">Biaya PLN (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="data-table-empty">Memuat data...</td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="data-table-empty">Tidak ada data</td>
                </tr>
              ) : (
                paginatedData.map((item, i) => {
                  const cost = (item.energy || 0) * PLN_TARIFF_PER_KWH;
                  return (
                    <tr key={item.id}>
                      <td>{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                      <td>{formatTimestamp(item.timestamp)}</td>
                      <td>{formatNumber(item.voltage, 1)}</td>
                      <td>{formatNumber(item.current, 2)}</td>
                      <td>{formatNumber(item.power, 0)}</td>
                      <td>{formatNumber(item.energy, 2)}</td>
                      <td className="col-cost">{formatRupiah(cost)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="data-pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <MdChevronLeft size={20} />
              Prev
            </button>
            <div className="page-numbers">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
              <MdChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
