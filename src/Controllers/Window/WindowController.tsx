import Roact from "@rbxts/roact";

export type WindowDragMode = "Contextual" | "Titlebar" | "Window";

export interface WindowControllerDefaultProps {
	/**
	 * Whether or not the window able to be dragged
	 */
	readonly IsDraggable: boolean;

	/**
	 * The window's drag mode
	 * - `Contextual` - Will use the titlebar if there is one, otherwise the window
	 * - `Titlebar` - Will only be draggable with a titlebar present
	 * - `Window` - Will be draggable via the window regardless
	 */
	readonly DragMode: WindowDragMode;
}
export interface WindowControllerProps extends WindowControllerDefaultProps {}

/**
 * ### ZenUI::WindowController
 *
 * An object that behaves like a window - can be dragged, have a titlebar etc.
 */
export class WindowController extends Roact.Component<WindowControllerProps> {
	public static defaultProps: WindowControllerDefaultProps = {
		IsDraggable: true,
	};

	public constructor(props: WindowControllerProps) {
		super(props);
	}

	public render() {
		return undefined;
	}
}
