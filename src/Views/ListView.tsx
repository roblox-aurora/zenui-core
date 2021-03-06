import Roact, { InferEnumNames } from "@rbxts/roact";
import Padding from "../Utility/Padding";
import { View, ViewProps } from "./View";

export interface ListViewDefaultProps {
	readonly FillDirection: InferEnumNames<Enum.FillDirection>;
	/**
	 * Automatically size to the direction of the `FillDirection` given
	 */
	readonly AutomaticSize: boolean;
}

export interface ListViewProps extends Pick<ViewProps, "Position" | "AnchorPoint">, ListViewDefaultProps {
	readonly ItemPadding?: number | UDim;
	readonly Size?: UDim2;
	readonly HorizontalAlignment?: InferEnumNames<Enum.HorizontalAlignment> | Enum.HorizontalAlignment;
	readonly VerticalAlignment?: InferEnumNames<Enum.VerticalAlignment> | Enum.VerticalAlignment;
	readonly Padding?: Padding;
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
	};

	public constructor(props: ListViewProps) {
		super(props);
		[this.size, this.setSize] = Roact.createBinding(new Vector2());
		[this.padding, this.setPadding] = Roact.createBinding(new Vector2());
	}

	public render(): Roact.Element | undefined {
		const {
			FillDirection,
			AutomaticSize,
			Size = new UDim2(1, 0, 1, 0),
			Padding: padding,
			ItemPadding,
		} = this.props;

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
				{padding !== undefined && (
					<Padding
						Padding={padding}
						ForwardRef={(_, padding) => {
							const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = padding;
							this.setPadding(new Vector2(Left + Right + Horizontal * 2, Top + Bottom + Vertical * 2));
						}}
					/>
				)}
				{this.props[Roact.Children]}
			</View>
		);
	}
}
