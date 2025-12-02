import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-6xl md:text-7xl font-bold uppercase mb-6 text-gray-800 tracking-tight">
            Maco<span className="text-blue-600">RMS</span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 mb-12">
            Building <span className="text-blue-500 font-semibold">Relationships</span>
          </p>
         
        </div>
      </div>
    </>
  );
}