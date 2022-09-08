import Roact from "@rbxts/roact";

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

/**
 * Padding dimensions
 */
export class UPaddingDim {
	public constructor(
		public readonly Left: UDim,
		public readonly Top: UDim,
		public readonly Right: UDim,
		public readonly Bottom: UDim,
	) {}

	public static readonly zero = UPaddingDim.axis(new UDim(), new UDim());

	/** @deprecated */
	public static from(this: void, scale: Padding, offset: Padding) {
		const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = scale;
		const {
			Left: leftOffset = 0,
			Right: rightOffset = 0,
			Top: topOffset = 0,
			Bottom: bottomOffset = 0,
			Vertical: verticalOffset = 0,
			Horizontal: horizontalOffset = 0,
		} = offset;

		const padding = new UPaddingDim(
			new UDim(Left + Horizontal, leftOffset + horizontalOffset),
			new UDim(Top + Vertical, topOffset + verticalOffset),
			new UDim(Right + Horizontal, rightOffset + horizontalOffset),
			new UDim(Bottom + Vertical, bottomOffset + verticalOffset),
		);
		return padding;
	}

	/** @deprecated */
	public static fromOffset(this: void, offset: Padding) {
		const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = offset;

		return new UPaddingDim(
			new UDim(0, Left + Horizontal),
			new UDim(0, Top + Vertical),
			new UDim(0, Right + Horizontal),
			new UDim(0, Bottom + Vertical),
		);
	}

	public static left(this: void, scale: number, offset: number) {
		return new UPaddingDim(new UDim(scale, offset), new UDim(), new UDim(), new UDim());
	}

	public static right(this: void, scale: number, offset: number) {
		return new UPaddingDim(new UDim(), new UDim(), new UDim(scale, offset), new UDim());
	}

	public static top(this: void, scale: number, offset: number) {
		return new UPaddingDim(new UDim(), new UDim(scale, offset), new UDim(), new UDim());
	}

	public static bottom(this: void, scale: number, offset: number) {
		return new UPaddingDim(new UDim(), new UDim(), new UDim(), new UDim(scale, offset));
	}

	public static axis(this: void, horizontal: UDim, vertical: UDim) {
		return new UPaddingDim(horizontal, vertical, horizontal, vertical);
	}

	public static horizontal(this: void, scale: number, offset: number) {
		const udim = new UDim(scale, offset);
		return new UPaddingDim(udim, udim, new UDim(), new UDim());
	}

	public static vertical(this: void, scale: number, offset: number) {
		const udim = new UDim(scale, offset);
		return new UPaddingDim(new UDim(), new UDim(), udim, udim);
	}

	/** @deprecated */
	public static fromScale(this: void, scale: Padding) {
		const { Left = 0, Right = 0, Top = 0, Bottom = 0, Vertical = 0, Horizontal = 0 } = scale;

		return new UPaddingDim(
			new UDim(Left + Horizontal, 0),
			new UDim(Top + Vertical, 0),
			new UDim(Right + Horizontal, 0),
			new UDim(Bottom + Vertical, 0),
		);
	}

	public add(other: UPaddingDim) {
		return new UPaddingDim(
			this.Left.add(other.Left),
			this.Right.add(other.Right),
			this.Top.add(other.Top),
			this.Bottom.add(other.Bottom),
		);
	}

	public sub(other: UPaddingDim) {
		return new UPaddingDim(
			this.Left.sub(other.Left),
			this.Right.sub(other.Right),
			this.Top.sub(other.Top),
			this.Bottom.sub(other.Bottom),
		);
	}
}

/** @deprecated Now `UPaddingDim` */
export const PaddingDim = UPaddingDim;
export type PaddingDim = UPaddingDim;

export default interface Padding {
	Left?: number;
	Top?: number;
	Right?: number;
	Bottom?: number;
	Vertical?: number;
	Horizontal?: number;
}
export interface PaddingProps {
	Padding: Padding | UPaddingDim;
	/** @deprecated */
	ForwardRef?: (rbx: UIPadding, padding: Padding) => void;
}
export default function Padding({ Padding: padding, ForwardRef: forwardRef }: PaddingProps) {
	if (padding instanceof UPaddingDim) {
		return (
			<uipadding
				PaddingLeft={padding.Left}
				PaddingTop={padding.Top}
				PaddingRight={padding.Right}
				PaddingBottom={padding.Bottom}
			/>
		);
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
