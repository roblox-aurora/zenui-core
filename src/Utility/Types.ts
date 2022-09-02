import Roact from "@rbxts/roact";

export type InferEnumNames<TEnum extends EnumItem> = TEnum extends { Name: infer TName; EnumType: Enum; Value: number }
	? TName
	: never;
export type InferEnumCodes<TEnum extends EnumItem> = TEnum extends { Value: infer TValue; EnumType: Enum; Name: string }
	? TValue
	: never;

export type RoactEnum<TEnum extends EnumItem> = TEnum | InferEnumNames<TEnum> | Roact.Binding<TEnum>;
