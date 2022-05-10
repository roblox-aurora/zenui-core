type PaddingResult = Pick<UIPadding, "PaddingTop" | "PaddingBottom" | "PaddingLeft" | "PaddingRight">;
type PaddingOffset = {
	[P in keyof PaddingResult]: number;
};

type PaddingAxisOffset = { PaddingHorizontal?: number; PaddingVertical?: number };

export type WidgetPadding = (Partial<PaddingOffset> & PaddingAxisOffset) | number;
export type WidgetAxisPadding = PaddingAxisOffset | number;

export function CalculatePaddingUDim2(padding: WidgetAxisPadding): UDim2 {
	if (typeIs(padding, "number")) {
		return new UDim2(0, padding, 0, padding);
	} else if ("PaddingHorizontal" in padding || "PaddingVertical" in padding) {
		const { PaddingHorizontal = 0, PaddingVertical = 0 } = padding;
		return new UDim2(0, PaddingHorizontal, 0, PaddingVertical);
	}

	throw `Invalid argument to CalculatePadding`;
}

export function CalculatePadding(padding: WidgetPadding): Partial<PaddingResult> {
	if (typeIs(padding, "number")) {
		return {
			PaddingBottom: new UDim(0, padding),
			PaddingLeft: new UDim(0, padding),
			PaddingRight: new UDim(0, padding),
			PaddingTop: new UDim(0, padding),
		};
	} else {
		let padLeft = 0;
		let padRight = 0;
		let padTop = 0;
		let padBottom = 0;

		if (padding.PaddingHorizontal !== undefined) {
			padLeft += padding.PaddingHorizontal;
			padRight += padding.PaddingHorizontal;
		}

		if (padding.PaddingVertical !== undefined) {
			padTop += padding.PaddingVertical;
			padBottom += padding.PaddingVertical;
		}

		if (padding.PaddingLeft !== undefined) padLeft += padding.PaddingLeft;
		if (padding.PaddingRight !== undefined) padRight += padding.PaddingRight;
		if (padding.PaddingTop !== undefined) padTop += padding.PaddingTop;
		if (padding.PaddingBottom !== undefined) padBottom += padding.PaddingBottom;

		return {
			PaddingBottom: new UDim(0, padBottom),
			PaddingTop: new UDim(0, padTop),
			PaddingLeft: new UDim(0, padLeft),
			PaddingRight: new UDim(0, padRight),
		};
	}
}

import Roact from "@rbxts/roact";
import variantModule, { isOfVariant, VariantOf } from "@rbxts/variant";

export const PaddingDim = variantModule({
	fromScale: (padding: Padding) => {
		const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = padding;

		return {
			Value: identity<Partial<UIPadding>>({
				PaddingLeft: new UDim(Left + Horizontal, 0),
				PaddingRight: new UDim(Right + Horizontal, 0),
				PaddingTop: new UDim(Top + Vertical, 0),
				PaddingBottom: new UDim(Bottom + Vertical, 0),
			}),
		};
	},
	fromOffset: (padding: Padding) => {
		const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = padding;

		return {
			Value: identity<Partial<UIPadding>>({
				PaddingLeft: new UDim(0, Left + Horizontal),
				PaddingRight: new UDim(0, Right + Horizontal),
				PaddingTop: new UDim(0, Top + Vertical),
				PaddingBottom: new UDim(0, Bottom + Vertical),
			}),
		};
	},
	from: (scale: Padding, offset: Padding) => {
		const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = scale;
		const {
			Left: leftOffset = 0,
			Right: rightOffset = 0,
			Top: topOffset = 0,
			Bottom: bottomOffset = 0,
			Vertical: verticalOffset = 0,
			Horizontal: horizontalOffset = 0,
		} = offset;

		return {
			Value: identity<Partial<UIPadding>>({
				PaddingLeft: new UDim(Left + Horizontal, leftOffset + horizontalOffset),
				PaddingRight: new UDim(Right + Horizontal, rightOffset + horizontalOffset),
				PaddingTop: new UDim(Top + Vertical, topOffset + verticalOffset),
				PaddingBottom: new UDim(Bottom + Vertical, bottomOffset + verticalOffset),
			}),
		};
	},
});
export type PaddingDim = VariantOf<typeof PaddingDim>;

export default interface Padding {
	Left?: number;
	Top?: number;
	Right?: number;
	Bottom?: number;
	Vertical?: number;
	Horizontal?: number;
}
export interface PaddingProps {
	Padding: Padding | PaddingDim;
	ForwardRef?: (rbx: UIPadding, padding: Padding) => void;
}
export default function Padding({ Padding: padding, ForwardRef: forwardRef }: PaddingProps) {
	if (isOfVariant(padding, PaddingDim)) {
		return <uipadding {...padding.Value} />;
	}

	const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = padding;

	return (
		<uipadding
			Ref={
				forwardRef !== undefined
					? (ref) => {
							forwardRef(ref, padding);
					  }
					: undefined
			}
			PaddingBottom={new UDim(0, Bottom + Vertical)}
			PaddingTop={new UDim(0, Top + Vertical)}
			PaddingRight={new UDim(0, Right + Horizontal)}
			PaddingLeft={new UDim(0, Left + Horizontal)}
		/>
	);
}
