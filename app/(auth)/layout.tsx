import AuthLayoutComponent from "@/app/layout/auth/layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutComponent>{children}</AuthLayoutComponent>;
}
