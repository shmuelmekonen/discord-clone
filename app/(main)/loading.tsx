// app/(main)/loading.tsx
export default function Loading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
    </div>
  );
}
