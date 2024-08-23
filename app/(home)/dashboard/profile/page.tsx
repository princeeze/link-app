import ProfileForm from "@/components/layout/profileform";

export default function Links() {
  return (
    <div className="flex max-h-full w-full flex-col">
      <div className="flex h-full flex-col gap-10">
        <div>
          <h1 className="heading-m pb-2 text-grey-dark">Profile Details</h1>
          <p className="body-m text-grey-default">
            Add your details to create a personal touch to your profile.
          </p>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
}
