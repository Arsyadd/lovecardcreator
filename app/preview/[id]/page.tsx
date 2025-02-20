export default function Page({ params }: { params: { id: string } }) {
  return <div>Preview ID: {params.id}</div>;
}
