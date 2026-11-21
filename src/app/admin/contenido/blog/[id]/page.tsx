import { blogDetails } from "@/config/content-details";
import AdminBlogEditorPage from "./client";

export function generateStaticParams() {
  return [...Object.keys(blogDetails), "nuevo"].map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminBlogEditorPage id={id} />;
}
