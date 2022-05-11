import Roact from "@rbxts/roact";
import { View } from "../Views/View";

export interface ColumnProps {
	Width?: UDim;
	VerticalAlignment?: Roact.InferEnumNames<Enum.VerticalAlignment> | Enum.VerticalAlignment;
	HorizontalAlignment?: Roact.InferEnumNames<Enum.HorizontalAlignment> | Enum.HorizontalAlignment;
}
/**
 * Represents a Column in a `<ColumnView/>` ({@link ColumnView})
 */
export function Column(props: Roact.PropsWithChildren<ColumnProps>) {
	return <>{props[Roact.Children]}</>;
}

export interface ColumnViewProps {
	Size?: UDim2;
}
/**
 * ### ZenUI::ColumnView
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
	public render(): Roact.Element | undefined {
		const children = this.props[Roact.Children];
		const containerMap = new Map<string | number, Roact.Element>();

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

			let idx = 0;
			const count = children.size();
			for (const [key, child] of children) {
				if (child.component === Column) {
					const props = child.props as ColumnProps;
					containerMap.set(
						key,
						<View
							Size={
								props.Width
									? new UDim2(props.Width.Scale, props.Width.Offset, 1, 0)
									: new UDim2((1 + scaleOffset) * (1 / autoSizeCount), widthOffset, 0, 0)
							}
							AutomaticSize="Y"
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
			<View Size={this.props.Size ?? new UDim2(1, 0, 0, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" />
				{containerMap}
			</View>
		);
	}
}
