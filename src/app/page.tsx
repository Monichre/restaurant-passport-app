import Image from "next/image";
import Link from "next/link";
import {
	SignInButton,
	SignOutButton,
	SignUpButton,
	useAuth,
	useUser,
} from "@clerk/nextjs";
import { auth, type Session, type Auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { getUserByClerkId } from "@/db/models/users/users";
import type { User } from "@/types/db";

export default async function Home() {
	// const { user } = useUser();
	const session = await auth();
	const { sessionClaims } = session;
	console.log("🚀 ~ Home ~ session:", session);

	console.log("🚀 ~ Home ~ sessionClaims:", sessionClaims);

	const userid = session?.userId;

	const user: User | null = userid ? await getUserByClerkId(userid) : null;
	console.log("🚀 ~ Home ~ user:", user);

	const userIsAdmin = user?.isAdmin || isAdmin(user);

	return (
		<div className="grid grid-rows-[60px_1fr_20px] items-center justify-items-center min-h-screen p-2 gap-16 font-geistSans">
			<nav className="w-full row-start-1 flex justify-between items-center px-8">
				<div className="flex items-center gap-6">
					<Link href="/">
						<Image
							src="/logo.png"
							alt="Restaurant Passport Logo"
							width={100}
							height={100}
						/>
					</Link>
				</div>
				<div className="flex gap-4">{!userid && <SignUpButton />}</div>
			</nav>

			<main className="flex flex-col gap-8 row-start-2 items-center">
				<h2 className="text-3xl font-bold text-center">
					Track Your Restaurant Adventures
				</h2>
				<p className="text-center max-w-lg">
					Keep track of restaurants you've visited, rate your experiences, and
					create your own food passport.
				</p>

				<div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
					{userid ? (
						<div className="flex gap-4">
							<Link
								href="/restaurants"
								className="rounded-full bg-[#e0d9d1] border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#e0d9d1] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
							>
								Browse Restaurants
							</Link>
						</div>
					) : (
						<div className="flex gap-4">
							<Link
								href="/sign-up"
								className="rounded-full  border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
							>
								Get Started
							</Link>
							<Link
								href="/restaurants"
								className="rounded-full bg-[#e0d9d1]  border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
							>
								Browse Restaurants
							</Link>
						</div>
					)}
				</div>
			</main>

			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
				<p>© {new Date().getFullYear()} Restaurant Passport App</p>
			</footer>
		</div>
	);
}
