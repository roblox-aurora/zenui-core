import Roact from "@rbxts/roact";
import Padding, { UPaddingDim } from "../Utility/Padding";
import { RoactEnum } from "../Utility/Types";
import { View } from "../Views/View";

export interface RowProps {
	/**
	 * The height of this row
	 */
	readonly Height?: UDim;
	/**
	 * The vertical alignment of the contents in this row
	 */
	readonly VerticalAlignment?: RoactEnum<Enum.VerticalAlignment>;
	/**
	 * The horizontal alignment of the contents in this row
	 */
	readonly HorizontalAlignment?: RoactEnum<Enum.HorizontalAlignment>;
}

/**
 * Represents a Row in a `<RowView/>` ({@link RowView})
 * @hidden
 */
export function Row(props: Roact.PropsWithChildren<RowProps>) {
	return <>{props[Roact.Children]}</>;
}

interface RowViewDefaultProps {
	/**
	 * The size of this row view container
	 */
	readonly Size: UDim2;

	/**
	 * The width of the rows (if not set, will be automatic)
	 */
	readonly RowWidth: UDim;
}

export interface RowViewProps extends RowViewDefaultProps {
	/**
	 * The amount of spacing between each column. If you want outer padding on the column view, use `Padding`.
	 */
	readonly RowSpacing?: UDim;
	/**
	 * The amount of padding around the column view
	 */
	readonly Padding?: Padding | UPaddingDim;

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
	public static defaultProps: RowViewDefaultProps = {
		RowWidth: new UDim(),
		Size: new UDim2(1, 0, 1, 0),
	};

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
					containerMap.set(
						key,
						<View
							LayoutOrder={idx}
							Size={
								props.Height
									? new UDim2(
											this.props.RowWidth.Scale,
											this.props.RowWidth.Offset,
											props.Height.Scale,
											props.Height.Offset,
									  )
									: new UDim2(
											this.props.RowWidth.Scale,
											this.props.RowWidth.Offset,
											(1 + scaleOffset) * (1 / autoSizeCount),
											widthOffset / autoSizeCount,
									  )
							}
							AutomaticSize={this.props.RowWidth !== new UDim() ? "X" : "None"}
						>
							<uilistlayout
								VerticalAlignment={
									props.VerticalAlignment ??
									(idx === 0 ? "Top" : idx === count - 1 ? "Bottom" : "Center")
								}
								HorizontalAlignment={props.HorizontalAlignment}
							/>
							{child}
						</View>,
					);
				}

				idx++;
			}
		}

		return (
			<View Size={this.props.Size} AutomaticSize="X">
				<uilistlayout
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
