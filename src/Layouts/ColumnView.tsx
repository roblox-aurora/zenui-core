import Roact from "@rbxts/roact";
import Padding, { UPaddingDim } from "../Utility/Padding";
import { RoactEnum } from "../Utility/Types";
import { View } from "../Views/View";

export interface ColumnProps {
	/**
	 * The width of this column
	 */
	readonly Width?: UDim;
	/**
	 * The vertical alignment of the contents in this column
	 */
	readonly VerticalAlignment?: RoactEnum<Enum.VerticalAlignment>;
	/**
	 * The horizontal alignment of the contents in this column
	 */
	readonly HorizontalAlignment?: RoactEnum<Enum.HorizontalAlignment>;
}
/**
 * Represents a Column in a `<ColumnView/>` ({@link ColumnView})
 * @hidden
 */
export function Column(props: Roact.PropsWithChildren<ColumnProps>) {
	return <>{props[Roact.Children]}</>;
}

interface ColumnViewDefaultProps {
	/**
	 * The height of the columns (if not set, will be automatic)
	 */
	readonly ColumnHeight: UDim;

	/**
	 * The size of this column view container
	 */
	readonly Size: UDim2;
}

export interface ColumnViewProps extends ColumnViewDefaultProps {
	/**
	 * The amount of spacing between each column. If you want outer padding on the column view, use `Padding`.
	 */
	readonly ColumnSpacing?: UDim;
	/**
	 * The amount of padding around the column view
	 */
	readonly Padding?: Padding | UPaddingDim;

	/**
	 * The horizontal alignment of the column
	 */
	readonly HorizontalAlignment?: RoactEnum<Enum.HorizontalAlignment>;

	/**
	 * The horizontal alignment of the column
	 */
	readonly VerticalAlignment?: RoactEnum<Enum.VerticalAlignment>;

	/**
	 * The maximum size this column view can be
	 */
	readonly MaxSize?: Vector2;

	/**
	 * The minimum size this column view can be
	 */
	readonly MinSize?: Vector2;
}
/**
 * ### ZenUI::ColumnView
 * **Note**: Do not mix with `RowView`
 *
 * A view that scales columns relative to how many `<Columns/>` there are, or to how they're sized. If you want static or certain sized columns, use the `Width` property on {@link Column}.
 *
 * Any other child component other than {@link Column} will be ignored.
 *
 * ```|___________Column____________|```
 *
 * ```|____Column____|___Column_____|```
 *
 * ```|_Column__|_Column__|_Column__|```
 *
 * etc.
 */
export class ColumnView extends Roact.Component<ColumnViewProps> {
	public static defaultProps: ColumnViewDefaultProps = {
		ColumnHeight: new UDim(),
		Size: new UDim2(1, 0, 1, 0),
	};

	/**
	 * Represents a Column in a `<ColumnView/>` ({@link ColumnView})
	 */
	public static Column = Column;

	public render(): Roact.Element | undefined {
		const children = this.props[Roact.Children];
		const containerMap = new Map<string | number, Roact.Element>();

		const colPadding = this.props.ColumnSpacing ?? new UDim();
		const padding = this.props.Padding;

		if (children) {
			let widthOffset = 0;
			let scaleOffset = 0;
			let autoSizeCount = 0;

			// pre-calculate sizes
			for (const [, child] of children) {
				if (child.component === Column) {
					const props = child.props as ColumnProps;
					if (props.Width) {
						widthOffset -= props.Width.Offset;
						scaleOffset -= props.Width.Scale;
					} else {
						autoSizeCount += 1;
					}
				}
			}

			const seperatorCount = math.max(0, children.size());

			widthOffset -= colPadding.Offset * (seperatorCount / children.size());
			scaleOffset -= colPadding.Scale * (seperatorCount / children.size());

			let idx = 0;
			const count = children.size();
			for (const [key, child] of children) {
				if (child.component === Column) {
					const props = child.props as ColumnProps;
					containerMap.set(
						key,
						<View
							LayoutOrder={idx}
							Size={
								props.Width
									? new UDim2(
											props.Width.Scale,
											props.Width.Offset,
											this.props.ColumnHeight.Scale,
											this.props.ColumnHeight.Offset,
									  )
									: new UDim2(
											(1 + scaleOffset) * (1 / autoSizeCount),
											widthOffset / autoSizeCount,
											this.props.ColumnHeight.Scale,
											this.props.ColumnHeight.Offset,
									  )
							}
							AutomaticSize={this.props.ColumnHeight === new UDim() ? "Y" : "None"}
						>
							<uilistlayout
								VerticalAlignment={props.VerticalAlignment}
								HorizontalAlignment={
									props.HorizontalAlignment ??
									(idx === 0 ? "Left" : idx === count - 1 ? "Right" : "Center")
								}
							/>
							{child}
						</View>,
					);
				}

				idx++;
			}
		}

		return (
			<View Size={this.props.Size} AutomaticSize={this.props.ColumnHeight !== new UDim() ? "None" : "Y"}>
				<uilistlayout
					Key="ColumnLayout"
					FillDirection="Horizontal"
					Padding={colPadding}
					SortOrder="LayoutOrder"
					VerticalAlignment={this.props.VerticalAlignment ?? "Center"}
					HorizontalAlignment={this.props.HorizontalAlignment ?? "Center"}
				/>
				{(this.props.MinSize !== undefined || this.props.MaxSize !== undefined) && (
					<uisizeconstraint
						Key="ColumnSizeConstraint"
						MinSize={this.props.MinSize}
						MaxSize={this.props.MaxSize}
					/>
				)}
				{padding && <Padding Key="ColumnPadding" Padding={padding} />}
				{containerMap}
			</View>
		);
	}
}
