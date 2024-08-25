import LinkForm from "@/components/layout/linkform";

export default function Links() {
  return (
    <div className="flex max-h-full w-full flex-col">
      <div className="flex h-full flex-col gap-10">
        <div>
          <h1 className="heading-m pb-2 text-grey-dark">
            Customize your links
          </h1>
          <p className="body-m text-grey-default">
            Add/edit/remove links below and then share all your profiles with
            the world!
          </p>
        </div>
        <LinkForm />
      </div>
    </div>
  );
}
