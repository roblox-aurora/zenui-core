import { TextService } from "@rbxts/services";
import Roact, { InferEnumNames } from "@rbxts/roact";

interface AutoSizedTextProps
	extends Partial<Pick<TextLabel, "Font" | "TextColor3" | "TextSize" | "Position" | "AnchorPoint">> {
	Text: string;
	Limits?: Vector2;
	MinTextSize?: number;
	MaxTextSize?: number;
	MinSize?: Vector2;
	MaxSize?: Vector2;
}
export function AutoSizedText(props: AutoSizedTextProps) {
	const {
		Text,
		TextColor3,
		TextSize = 15,
		Font = Enum.Font.SourceSans,
		Limits,
		Position,
		AnchorPoint,
		MinSize,
		MinTextSize,
		MaxTextSize,
	} = props;

	const size = TextService.GetTextSize(Text, TextSize, Font, Limits ?? new Vector2(1000, 1000));
	const minX = MinSize?.X ?? 0;

	return (
		<textlabel
			BackgroundTransparency={1}
			Text={Text}
			Position={Position}
			AnchorPoint={AnchorPoint}
			TextSize={TextSize}
			Font={Font}
			TextScaled={MaxTextSize !== undefined}
			Size={UDim2.fromOffset(math.max(minX, size.X), size.Y)}
			TextColor3={TextColor3 ?? Color3.fromRGB(220, 220, 220)}
			TextXAlignment="Left"
			TextWrapped
		>
			<uitextsizeconstraint MinTextSize={MinTextSize} MaxTextSize={MaxTextSize} />
		</textlabel>
	);
}
