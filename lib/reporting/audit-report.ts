import jsPDF from "jspdf";
import type { Livestock, Transaction, VaccinationRecord } from "@/types/agriculture";

interface GenerateAuditReportParams {
  livestock: Livestock[];
  transactions: Transaction[];
  vaccinations: VaccinationRecord[];
}

export function generateAuditReport(params: GenerateAuditReportParams) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Zianda Agri-Hub - Farm Audit Report", 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  doc.setFontSize(12);
  doc.text("Livestock overview", 14, 40);
  doc.setFontSize(10);
  doc.text(`Total animals: ${params.livestock.length}`, 14, 46);

  doc.text("Financial summary", 14, 60);
  const totalExpenses = params.transactions.reduce((sum, t) => sum + t.amount, 0);
  doc.text(`Total tracked expenses: ${totalExpenses.toFixed(2)} ${params.transactions[0]?.currency ?? ""}`, 14, 66);

  doc.text("Vaccination records", 14, 80);
  doc.text(`Total vaccinations logged: ${params.vaccinations.length}`, 14, 86);

  return doc;
}

