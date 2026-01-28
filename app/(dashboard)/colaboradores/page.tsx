import { getCollaborators } from "../../api";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";

export default async function CollaboratorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const collaborators = await getCollaborators(page);

  // If you need pagination, adjust getCollaborators to return pagination info as well.
  // Helper to build pagination URL preserving other params
  const getPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    return `/colaboradores?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Colaboradores</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* <aside className="w-full md:w-64 shrink-0">
          <CollaboratorsFilter categories={categories} />
        </aside> */}

        <div className="flex-1">
          <div className="grid gap-4">
            {collaborators.map((collaborator) => (
              <Link
                key={collaborator.id}
                href={`#`}
                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {collaborator.department && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border-primary bg-green-50 text-primary">
                          {collaborator.department}
                        </span>
                      )}
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {collaborator.birth_date
                          ? new Date(
                              collaborator.birth_date,
                            ).toLocaleDateString()
                          : "Sem data"}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      {collaborator.url_photo ? (
                        <div className="flex items-center gap-4 mr-4">
                          <img
                            src={collaborator.url_photo}
                            alt={collaborator.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold mr-4">
                          {collaborator.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">
                          {collaborator.name}
                        </h3>
                        <p className="text-black text-sm ">
                          Cargo: {collaborator.position}
                        </p>
                        <p className="text-black text-sm">
                          Email: {collaborator.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {collaborators.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum colaborador encontrado.</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link
                href={getPaginationUrl(page - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Anterior
              </Link>
            )}
            {/* {last_page && page < last_page && (
              <Link
                href={getPaginationUrl(page + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Próxima
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
