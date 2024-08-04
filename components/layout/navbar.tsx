import Image from "next/image";
import logo from "@/public/logo.svg";

export default function Navbar() {
  return (
    <div className="bg-grey-light p-6">
      <div className="bg-white flex justify-between items-center ">
        <Image src={logo} alt="logo" className="w-36" />
        <div className="flex p-4 items-center">button 1 button 2</div>
        preview
      </div>
    </div>
  );
}
