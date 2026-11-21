export type MemberStatus = "Activo" | "En discipulado" | "Visitante";

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  ministry: string;
  status: MemberStatus;
  isBaptized: boolean;
  joinDate: string;
}

// Datos sintéticos para revisar la interfaz. Los dominios .invalid no reciben correo.
export const ADMIN_SAMPLE_MEMBERS: AdminMember[] = [
  {
    id: "member-01",
    name: "Carlos Morales",
    email: "carlos.morales@example.invalid",
    phone: "No asignado",
    ministry: "Embajadores",
    status: "Activo",
    isBaptized: true,
    joinDate: "2024-01-15",
  },
  {
    id: "member-02",
    name: "Verónica Sánchez",
    email: "veronica.sanchez@example.invalid",
    phone: "No asignado",
    ministry: "Familias",
    status: "Activo",
    isBaptized: true,
    joinDate: "2023-03-08",
  },
  {
    id: "member-03",
    name: "David Andrade",
    email: "david.andrade@example.invalid",
    phone: "No asignado",
    ministry: "Adoración",
    status: "Activo",
    isBaptized: true,
    joinDate: "2024-09-22",
  },
  {
    id: "member-04",
    name: "Camila Salazar",
    email: "camila.salazar@example.invalid",
    phone: "No asignado",
    ministry: "Exploradores",
    status: "En discipulado",
    isBaptized: false,
    joinDate: "2026-11-03",
  },
];

export function formatSampleDate(isoDate: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
