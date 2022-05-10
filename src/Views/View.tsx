import Roact, { PropsWithChildren } from "@rbxts/roact";

export type ViewProps = Roact.JsxInstanceProperties<Frame>;

/**
 * A frame that's by default transparent, and size of `UDim2.fromScale(1, 1)`
 */
export function View(props: ViewProps) {
	return <frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)} {...props} />;
}
