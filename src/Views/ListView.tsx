import Roact from "@rbxts/roact";
import Padding, { UPaddingDim } from "../Utility/Padding";
import { InferEnumNames } from "../Utility/Types";
import { View, ViewProps } from "./View";

export interface ListViewDefaultProps {
	readonly Size: UDim2;

	readonly FillDirection: InferEnumNames<Enum.FillDirection>;
	/**
	 * Automatically size to the direction of the `FillDirection` given
	 */
	readonly AutomaticSize: boolean;
}

export interface ListViewProps extends Pick<ViewProps, "Position" | "AnchorPoint">, ListViewDefaultProps {
	readonly ItemPadding?: number | UDim;

	readonly HorizontalAlignment?: InferEnumNames<Enum.HorizontalAlignment>;
	readonly VerticalAlignment?: InferEnumNames<Enum.VerticalAlignment>;
	readonly Padding?: UPaddingDim;
}

/**
 * ### ZenUI::ListView
 *
 * A view that has an inbuilt {@link UIListLayout} that has the ability to automatically size. Also contains {@link Padding} support.
 */
export class ListView extends Roact.Component<ListViewProps> {
	private size: Roact.Binding<Vector2>;
	private setSize: Roact.BindingFunction<Vector2>;

	private padding: Roact.Binding<Vector2>;
	private setPadding: Roact.BindingFunction<Vector2>;

	public static defaultProps: ListViewDefaultProps = {
		FillDirection: "Vertical",
		AutomaticSize: false,
		Size: new UDim2(1, 0, 1, 0),
	};

	public constructor(props: ListViewProps) {
		super(props);
		[this.size, this.setSize] = Roact.createBinding(new Vector2());
		[this.padding, this.setPadding] = Roact.createBinding(new Vector2());
	}

	public render(): Roact.Element | undefined {
		const { FillDirection, AutomaticSize, Size, Padding: padding, ItemPadding } = this.props;

		const children = this.props[Roact.Children];
		if (children) {
			for (const [k, child] of pairs(children)) {
				if (child.component === "UIListLayout" || child.component === "UIGridLayout") {
					warn("Duplicate UILayout '" + tostring(k) + "' in ListView - removed!");
					children.delete(k);
				}

				if (child.component === "UIPadding" && padding !== undefined) {
					warn("Duplicate UIPadding '" + tostring(k) + "' in ListView - removed!");
					children.delete(k);
				}
			}
		}

		const binds = Roact.joinBindings({ size: this.size, padding: this.padding });

		return (
			<View
				Position={this.props.Position}
				AnchorPoint={this.props.AnchorPoint}
				Size={binds.map((v) => {
					const { size, padding } = v;

					if (AutomaticSize) {
						if (FillDirection === "Vertical") {
							return new UDim2(Size.X.Scale, Size.X.Offset, 0, size.Y + padding.Y);
						} else {
							return new UDim2(0, size.X + padding.X, Size.Y.Scale, Size.Y.Offset);
						}
					} else {
						return Size;
					}
				})}
			>
				<uilistlayout
					Padding={typeIs(ItemPadding, "number") ? new UDim(0, ItemPadding) : ItemPadding}
					FillDirection={this.props.FillDirection}
					HorizontalAlignment={this.props.HorizontalAlignment}
					VerticalAlignment={this.props.VerticalAlignment}
					Change={{
						AbsoluteContentSize: (listLayout) => {
							this.setSize(listLayout.AbsoluteContentSize);
						},
					}}
				/>
				{padding !== undefined && <Padding Padding={padding} />}
				{this.props[Roact.Children]}
			</View>
		);
	}
}
