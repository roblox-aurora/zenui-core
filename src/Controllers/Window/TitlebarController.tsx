import Roact from "@rbxts/roact";

export interface TitlebarControllerDefaultProps {}
export interface TitlebarControllerProps extends TitlebarControllerDefaultProps {}

/**
 * ### ZenUI::WindowController
 *
 * An object that behaves like a window - can be dragged, have a titlebar etc.
 */
export class TitlebarController extends Roact.Component<TitlebarControllerProps> {
	public static defaultProps: TitlebarControllerDefaultProps = {};

	public constructor(props: TitlebarControllerProps) {
		super(props);
	}

	public render() {
		return undefined;
	}
}
