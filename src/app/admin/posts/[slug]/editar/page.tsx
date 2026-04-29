import { getAllSlugs } from '@/lib/supabase/queries';
import EditarArtigoClient from './EditarArtigoClient';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export default function EditarArtigo({ params }: { params: { slug: string } }) {
  return <EditarArtigoClient slug={params.slug} />;
}
