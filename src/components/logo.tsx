import Image from "next/image";

export const Logo = () => {
	return (
		<div>
			<Image src="/logo.png" alt="logo" width={100} height={100} />
		</div>
	);
};
