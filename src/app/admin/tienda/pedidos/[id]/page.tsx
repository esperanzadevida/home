import AdminPedidoDetallePage from "./client";

export function generateStaticParams() {
  return ["1", "2", "3", "4"].map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminPedidoDetallePage id={id} />;
}
