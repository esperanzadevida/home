import { MOCK_PRODUCTS } from "@/constants/data";
import AdminProductEditorPage from "./client";

export function generateStaticParams() {
  return [...MOCK_PRODUCTS.map(({ id }) => id), "nuevo"].map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProductEditorPage id={id} />;
}
