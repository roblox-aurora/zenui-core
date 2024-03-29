import Roact from "@rbxts/roact";
import Padding, { UPaddingDim } from "../Utility/Padding";
import { InferEnumNames, WritablePropertiesOf, RoactEnum } from "../Utility/Types";
import { View } from "../Views/View";

export interface RowProps {
	/**
	 * The height of this row
	 */
	readonly Height?: UDim;

	/**
	 * The maximum height of this row
	 */
	readonly MaxHeight?: number;

	/**
	 * Automatic Height
	 */
	readonly AutomaticHeight?: boolean;

	/**
	 * The minimum height of this row
	 */
	readonly MinHeight?: number;

	/**
	 * The vertical alignment of the contents in this row
	 */
	readonly VerticalAlignment?: RoactEnum<Enum.VerticalAlignment>;
	/**
	 * The horizontal alignment of the contents in this row
	 */
	readonly HorizontalAlignment?: RoactEnum<Enum.HorizontalAlignment>;

	/**
	 * The padding between the items in the row
	 */
	readonly LayoutPadding?: UDim;

	/**
	 * The layout order of the children of this column
	 */
	readonly SortOrder?: InferEnumNames<Enum.SortOrder> | Enum.SortOrder;
}

/**
 * Represents a Row in a `<RowView/>` ({@link RowView})
 * @hidden
 */
export function Row(props: Roact.PropsWithChildren<RowProps>) {
	return <>{props[Roact.Children]}</>;
}

type ScrollingFrameProperties = WritablePropertiesOf<
	Omit<ScrollingFrame, "CanvasSize" | "CanvasPosition">,
	keyof GuiObject
>;

interface RowViewDefaultProps {
	/**
	 * The size of this row view container
	 */
	readonly Size: UDim2;

	/**
	 * The width of the rows (if not set, will be automatic)
	 */
	readonly RowWidth: UDim;

	/**
	 * Automatic sizing rules
	 */
	readonly AutomaticSize?: Enum.AutomaticSize | InferEnumNames<Enum.AutomaticSize>;

	/**
	 * Whether or not this `RowView` scrols
	 */
	readonly Scrolling: boolean | Partial<ScrollingFrameProperties>;
}

export interface RowViewProps extends RowViewDefaultProps {
	/**
	 * The amount of spacing between each column. If you want outer padding on the column view, use `Padding`.
	 */
	readonly RowSpacing?: UDim;
	/**
	 * The amount of padding around the column view
	 */
	readonly Padding?: UPaddingDim;

	/**
	 * The horizontal alignment of the row
	 */
	readonly VerticalAlignment?: RoactEnum<Enum.VerticalAlignment>;

	/**
	 * The maximum size this row view can be
	 */
	readonly MaxSize?: Vector2;

	/**
	 * The minimum size this row view can be
	 */
	readonly MinSize?: Vector2;
}
/**
 * ### ZenUI::RowView
 * **Note**: Do not mix with `ColumnView` directly.
 *
 * A view that scales columns relative to how many `<Row/>`s there are, or to how they're sized. If you want static or certain sized rows, use the `Height` property on {@link Row}.
 *
 * Any other child component other than {@link Row} will be ignored.
 * etc.
 */
export class RowView extends Roact.Component<RowViewProps> {
	public contentsSize: Roact.Binding<Vector2>;
	public setContentSize: Roact.BindingFunction<Vector2>;

	public static defaultProps: RowViewDefaultProps = {
		RowWidth: new UDim(),
		Size: new UDim2(1, 0, 1, 0),
		Scrolling: false,
	};

	private layoutRef = Roact.createRef<UIListLayout>();

	public constructor(props: RowViewProps) {
		super(props);
		[this.contentsSize, this.setContentSize] = Roact.createBinding(new Vector2());
	}

	protected didMount(): void {
		const layoutRef = this.layoutRef.getValue();

		if (layoutRef !== undefined) {
			this.setContentSize(layoutRef.AbsoluteContentSize);
		}
	}

	/**
	 * Represents a Row in a `<RowView/>` ({@link RowView})
	 */
	public static Row = Row;

	public render(): Roact.Element | undefined {
		const children = this.props[Roact.Children];
		const containerMap = new Map<string | number, Roact.Element>();

		const colPadding = this.props.RowSpacing ?? new UDim();
		const padding = this.props.Padding;

		if (children) {
			let widthOffset = 0;
			let scaleOffset = 0;
			let autoSizeCount = 0;

			// pre-calculate sizes
			for (const [, child] of children) {
				if (child.component === Row) {
					const props = child.props as RowProps;
					if (props.Height) {
						widthOffset -= props.Height.Offset;
						scaleOffset -= props.Height.Scale;
					} else {
						autoSizeCount += 1;
					}
				}
			}

			const seperatorCount = math.max(0, children.size());

			widthOffset -= colPadding.Offset * seperatorCount;
			scaleOffset -= colPadding.Scale * seperatorCount;

			let idx = 0;
			const count = children.size();
			for (const [key, child] of children) {
				if (child.component === Row) {
					const props = child.props as RowProps;

					let height: UDim2;
					let automaticSize: Enum.AutomaticSize = Enum.AutomaticSize.None;
					const shouldAutoX = this.props.RowWidth === new UDim();
					const shouldAutoY = props.AutomaticHeight === true;

					if (props.Height) {
						height = new UDim2(
							this.props.RowWidth.Scale,
							this.props.RowWidth.Offset,
							props.Height.Scale,
							props.Height.Offset,
						);
					} else {
						height = new UDim2(
							this.props.RowWidth.Scale,
							this.props.RowWidth.Offset,
							props.AutomaticHeight ? 0 : (1 + scaleOffset) * (1 / autoSizeCount),
							widthOffset / autoSizeCount,
						);
					}

					if (shouldAutoX && shouldAutoY) {
						automaticSize = Enum.AutomaticSize.XY;
					} else if (shouldAutoY) {
						automaticSize = Enum.AutomaticSize.Y;
					} else if (shouldAutoX) {
						automaticSize = Enum.AutomaticSize.X;
					}

					containerMap.set(
						key,
						<View LayoutOrder={idx} Size={height} AutomaticSize={automaticSize}>
							{(props.MaxHeight !== undefined || props.MinHeight !== undefined) && (
								<uisizeconstraint
									Key="ColumnItemSizeConstraint"
									MinSize={
										props.MinHeight !== undefined ? new Vector2(0, props.MinHeight) : undefined
									}
									MaxSize={
										props.MaxHeight !== undefined
											? new Vector2(math.huge, props.MaxHeight)
											: undefined
									}
								/>
							)}
							<uilistlayout
								VerticalAlignment={
									props.VerticalAlignment ??
									(idx === 0 ? "Top" : idx === count - 1 ? "Bottom" : "Center")
								}
								HorizontalAlignment={props.HorizontalAlignment}
								Padding={props.LayoutPadding}
								SortOrder={props.SortOrder}
							/>
							{child}
						</View>,
					);
				}

				idx++;
			}
		}

		if (this.props.Scrolling !== undefined && !!this.props.Scrolling) {
			const defaultProperties = identity<Partial<ScrollingFrameProperties>>({
				ScrollBarThickness: 5,
				ScrollBarImageColor3: Color3.fromRGB(0, 0, 0),
			});
			const properties = typeIs(this.props.Scrolling, "boolean")
				? defaultProperties
				: { ...defaultProperties, ...this.props.Scrolling };

			return (
				<scrollingframe
					BorderSizePixel={0}
					BackgroundTransparency={1}
					Size={this.props.Size}
					{...properties}
					AutomaticSize={this.props.AutomaticSize ?? (this.props.RowWidth !== new UDim() ? "None" : "X")}
					CanvasSize={this.contentsSize.map((size) => new UDim2(0, size.X, 0, size.Y))}
				>
					<uilistlayout
						Ref={this.layoutRef}
						Key="RowLayout"
						SortOrder="LayoutOrder"
						FillDirection="Vertical"
						Padding={colPadding}
						VerticalAlignment={this.props.VerticalAlignment ?? "Top"}
					/>
					{(this.props.MinSize !== undefined || this.props.MaxSize !== undefined) && (
						<uisizeconstraint
							Key="RowSizeConstraint"
							MinSize={this.props.MinSize}
							MaxSize={this.props.MaxSize}
						/>
					)}
					{padding && <Padding Key="RowPadding" Padding={padding} />}
					{containerMap}
				</scrollingframe>
			);
		} else {
			return (
				<View
					Size={this.props.Size}
					AutomaticSize={this.props.AutomaticSize ?? (this.props.RowWidth !== new UDim() ? "None" : "X")}
				>
					<uilistlayout
						Ref={this.layoutRef}
						Key="RowLayout"
						SortOrder="LayoutOrder"
						FillDirection="Vertical"
						Padding={colPadding}
						VerticalAlignment={this.props.VerticalAlignment ?? "Center"}
					/>
					{(this.props.MinSize !== undefined || this.props.MaxSize !== undefined) && (
						<uisizeconstraint
							Key="RowSizeConstraint"
							MinSize={this.props.MinSize}
							MaxSize={this.props.MaxSize}
						/>
					)}
					{padding && <Padding Key="RowPadding" Padding={padding} />}
					{containerMap}
				</View>
			);
		}
	}
}
