import Link from "next/link";

const Home = () => {
  return (
    <div>
      <p>Home</p>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
    </div>
  );
};

export default Home;
