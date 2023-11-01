import Preview from "@/components/Preview";

function PlatFormPreview() {
  const pageId = window.location.pathname.split("/").at(-1) as string;
  return <Preview pageId={pageId} />
}

export default PlatFormPreview
