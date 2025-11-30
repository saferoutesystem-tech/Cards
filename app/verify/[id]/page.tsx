"use client";

export default function VerifyPage({ searchParams }) {
  const id = searchParams?.id;

  if (!id) {
    return <div>Invalid or missing ID</div>;
  }

  return (
    <div>
      <h1>Verify Card</h1>
      <p>Card ID: {id}</p>
      {/* Your verification logic here */}
    </div>
  );
}
