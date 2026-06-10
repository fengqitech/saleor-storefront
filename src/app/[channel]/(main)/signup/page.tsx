import { Suspense } from "react";
import { type Metadata } from "next";
import { Loader } from "@/ui/atoms/loader";
import { SignUpForm } from "@/ui/components/sign-up-form";
import { buildTenantRouteMetadata } from "@/lib/seo/route-metadata.server";

export async function generateMetadata(props: { params: Promise<{ channel: string }> }): Promise<Metadata> {
	const { channel } = await props.params;
	return buildTenantRouteMetadata({
		title: "Create Account",
		description: "Create a new account to save your addresses and order history.",
		canonicalPath: `/${channel}/signup`,
		noIndex: true,
	});
}

export default function SignUpPage() {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<SignUpForm />
			</section>
		</Suspense>
	);
}
