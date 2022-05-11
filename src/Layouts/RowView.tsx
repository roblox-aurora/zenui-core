import Roact, { InferEnumNames } from "@rbxts/roact";
import Padding, { PaddingDim } from "../Utility/Padding";
import { View } from "../Views/View";

export interface RowProps {
	Height?: UDim;
	VerticalAlignment?: Roact.InferEnumNames<Enum.VerticalAlignment> | Enum.VerticalAlignment;
	HorizontalAlignment?: Roact.InferEnumNames<Enum.HorizontalAlignment> | Enum.HorizontalAlignment;
}
/**
 * Represents a Row in a `<RowView/>` ({@link RowView})
 * @hidden
 */
export function Row(props: Roact.PropsWithChildren<RowProps>) {
	return <>{props[Roact.Children]}</>;
}

export interface RowViewProps {
	readonly Size?: UDim2;
	/**
	 * The amount of spacing between each column. If you want outer padding on the column view, use `Padding`.
	 */
	readonly RowSpacing?: UDim;
	/**
	 * The amount of padding around the column view
	 */
	readonly Padding?: Padding | PaddingDim;

	/**
	 * The horizontal alignment of the row
	 */
	readonly VerticalAlignment?: InferEnumNames<Enum.VerticalAlignment> | Enum.VerticalAlignment;
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
							Size={
								props.Height
									? new UDim2(1, 0, props.Height.Scale, props.Height.Offset)
									: new UDim2(
											0,
											0,
											(1 + scaleOffset) * (1 / autoSizeCount),
											widthOffset / autoSizeCount,
									  )
							}
							AutomaticSize="X"
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
			<View Size={this.props.Size ?? new UDim2(0, 0, 1, 0)} AutomaticSize="X">
				<uilistlayout
					FillDirection="Vertical"
					Padding={colPadding}
					VerticalAlignment={this.props.VerticalAlignment ?? "Center"}
				/>
				{padding && <Padding Padding={padding} />}
				{containerMap}
			</View>
		);
	}
}
