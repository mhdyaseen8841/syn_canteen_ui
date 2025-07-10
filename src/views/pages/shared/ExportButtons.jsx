import React from 'react';
import { Button, Stack } from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const metaTitles = {
  month: 'Month',
  company: 'Company',
  type: 'Employee Type',
  name: 'Employee Name',
  code: 'Employee Code',
  emp_id: 'Employee ID',
  total: 'Total',
  premium: 'AC Dine Charge',
  total_with_premium: 'Total with Premium'
};

export default function ExportButtons({ sections, data, headers, fileName = 'export', meta = {} }) {
  const metaEntries = Object.entries(meta).filter(([_, value]) => value !== undefined && value !== '');

  const now = new Date();
  const timestamp = `${now.getDate().toString().padStart(2, '0')}-${now.toLocaleString('default', {
    month: 'short'
  })}-${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;

  const finalFileName = `${fileName}_${timestamp}`;

  const formatMetaKey = (key) =>
    metaTitles[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const getSections = () => {
    if (sections && Array.isArray(sections)) return sections;

    if (data && headers) {
      return [
        {
          title: fileName.replace(/_/g, ' '),
          headers,
          data
        }
      ];
    }

    return [];
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    const metaRows = metaEntries.map(([key, value]) => [`${formatMetaKey(key)}: ${value}`]);
    wsData.push(...metaRows, []);

    const currentSections = getSections();
    for (const section of currentSections) {
      if (!Array.isArray(section.data) || !Array.isArray(section.headers)) continue;

      wsData.push([section.title]);
      wsData.push(section.headers);
      section.data.forEach((row) => {
        wsData.push(section.headers.map((h) => row?.[h] ?? ''));
      });
      wsData.push([]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, worksheet, 'Report');
    XLSX.writeFile(wb, `${finalFileName}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);

    metaEntries.forEach(([key, value]) => {
      doc.text(`${formatMetaKey(key)}: ${value}`, 10, y);
      y += 7;
    });

    y += 5;

    const currentSections = getSections();
    for (const section of currentSections) {
      if (!Array.isArray(section.data) || !Array.isArray(section.headers)) continue;

      doc.text(section.title, 10, y);
      y += 7;

      autoTable(doc, {
        head: [section.headers],
        body: section.data.map((row) => section.headers.map((h) => row?.[h] ?? '')),
        startY: y
      });

      y = doc.lastAutoTable.finalY + 10;
    }

    doc.save(`${finalFileName}.pdf`);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button variant="outlined" onClick={exportToExcel}>
        Export Excel
      </Button>
      <Button variant="outlined" onClick={exportToPDF}>
        Export PDF
      </Button>
    </Stack>
  );
}
