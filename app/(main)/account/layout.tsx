import { AccountLayout } from "@/components/AccountLayout";

export default function AccountSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayout>{children}</AccountLayout>;
}
