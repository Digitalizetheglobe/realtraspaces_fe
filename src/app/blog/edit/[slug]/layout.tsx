import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Blog Post - Realtraspaces',
  description: 'Edit your blog post on Realtraspaces',
};

export default function EditBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
