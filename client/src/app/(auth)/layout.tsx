'use client';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="flex-1 flex flex-col">{children}</div>;
}
