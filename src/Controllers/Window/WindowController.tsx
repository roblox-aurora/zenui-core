import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import Snapdragon, { SnapdragonController, SnapMargin } from "@rbxts/snapdragon";
import Padding, { UPaddingDim } from "../../Utility/Padding";
import { View } from "../../Views/View";
import { TitlebarController } from "./TitlebarController";

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

	/**
	 * The padding for the window container
	 */
	readonly Padding: UPaddingDim;

	/**
	 * Whether or not snapping is enabled for this window
	 */
	readonly SnapEnabled: boolean;

	/**
	 * If true, the snap will ignore the offset set by GuiService.
	 */
	readonly SnapIgnoresOffset: boolean;

	/**
	 * The margin of the screen the snap adheres to
	 */
	readonly SnapMargin: SnapMargin;

	/**
	 * The threshold margin for snapping.
	 *
	 * The bigger it is, the more snappy the snapping gets.
	 *
	 * The value for each axis is added onto the `SnapMargin`.
	 *
	 * So a SnapMargin of {Vertical: 50, Horizontal: 50}
	 *
	 * plus a SnapThresholdMargin of {Vertical: 25, Horizontal: 25}
	 *
	 * Will case the snap to occur at {Vertical: 75, Horizontal: 75}
	 */
	readonly SnapThresholdMargin: SnapMargin;

	/**
	 * The size of the window
	 */
	readonly Size: UDim2;
}

export interface WindowControllerProps extends WindowControllerDefaultProps {
	/**
	 * Event called when the window begins dragging
	 */
	DragBegan?: (pos: Vector3) => void;

	/**
	 * Event called when the window finishes dragging
	 */
	DragEnded?: (pos: Vector3) => void;

	// /**
	//  * @experimental
	//  * Save the position of the window
	//  */
	// SavePosition?: boolean;

	/**
	 * Event called when the position is changed
	 */
	PositionChanged?: (pos: UDim2) => void;
}

/**
 * ### ZenUI::WindowController
 *
 * An object that behaves like a window - can be dragged, have a titlebar etc.
 */
export class WindowController extends Roact.Component<WindowControllerProps> {
	public static defaultProps: WindowControllerDefaultProps = {
		IsDraggable: true,
		DragMode: "Contextual",
		Padding: UPaddingDim.zero,
		SnapEnabled: true,
		SnapIgnoresOffset: false,
		SnapMargin: {},
		SnapThresholdMargin: {},
		Size: new UDim2(0, 800, 0, 600),
	};

	private dragRef = Snapdragon.createRef();
	private windowRef = Roact.createRef<Frame>();
	private dragController: SnapdragonController | undefined;

	private maid = new Maid();

	public constructor(props: WindowControllerProps) {
		super(props);
		UPaddingDim.axis(new UDim(), new UDim());
	}

	public override didMount() {
		let titlebarEnabled = false;
		const children = this.props[Roact.Children];
		if (children) {
			for (const [, child] of children) {
				if (child.component === TitlebarController) {
					titlebarEnabled = true;
					break;
				}
			}
		}

		const { IsDraggable, DragMode, SnapEnabled, SnapMargin, SnapThresholdMargin: SnapThreshold } = this.props;
		const windowRef = this.windowRef.getValue();
		if (windowRef !== undefined) {
			this.dragRef.Update(windowRef);

			this.dragController = new SnapdragonController(this.dragRef, {
				SnapEnabled,
				SnapThreshold,
				SnapMargin,
			});

			if ((titlebarEnabled === false || DragMode === "Window") && IsDraggable === true) {
				this.dragController.Connect();

				if (this.props.DragBegan) {
					this.maid.GiveTask(
						this.dragController.DragBegan.Connect((began) => {
							this.props.DragBegan?.(began.InputPosition);
						}),
					);
				}

				if (this.props.DragEnded) {
					this.maid.GiveTask(
						this.dragController.DragEnded.Connect((ended) => {
							this.props.DragEnded?.(ended.InputPosition);
						}),
					);
				}

				this.maid.GiveTask(
					this.dragController.DragEnded.Connect(() => {
						this.props.PositionChanged?.(windowRef.Position);
					}),
				);
			}

			this.maid.GiveTask(this.dragController);
		}
	}

	public render() {
		return (
			<View Size={this.props.Size}>
				<Padding Padding={this.props.Padding} />
				{this.props[Roact.Children]}
			</View>
		);
	}
}
