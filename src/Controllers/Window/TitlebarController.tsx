import Roact from "@rbxts/roact";

export interface TitlebarControllerDefaultProps {}
export interface TitlebarControllerProps extends TitlebarControllerDefaultProps {}

/**
 * ### ZenUI::TitlebarController
 *
 * When under a window, will take precedence for dragging etc. unless explicitly defined not to
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
