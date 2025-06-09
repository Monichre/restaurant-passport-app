declare module "react-qr-scanner" {
	import { Component } from "react";

	export interface QrScannerProps {
		onScan: (data: { text: string } | null) => void;
		onError: (err: Error) => void;
		style?: React.CSSProperties;
		className?: string;
		delay?: number;
		facingMode?: string;
		resolution?: number;
		constraints?: MediaTrackConstraints;
		chooseDeviceId?: () => string;
		[key: string]: unknown;
	}

	export default class QrScanner extends Component<QrScannerProps> {}
}
