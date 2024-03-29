import Roact from "@rbxts/roact";
import { t } from "@rbxts/t";

export type InferEnumNames<TEnum extends EnumItem> = TEnum extends { Name: infer TName; EnumType: Enum; Value: number }
	? TName
	: never;
export type InferEnumCodes<TEnum extends EnumItem> = TEnum extends { Value: infer TValue; EnumType: Enum; Name: string }
	? TValue
	: never;

export type RoactEnum<TEnum extends EnumItem> = TEnum | InferEnumNames<TEnum> | Roact.Binding<TEnum>;

export type ComponentLike<TProps = any> = Roact.FunctionComponent<TProps> | Roact.Component<TProps, any>;

export type InferProps<T> = T extends (props: infer A) => Roact.Element
	? A
	: T extends Roact.Component<infer A>
	? A
	: T extends Roact.HostComponent
	? Partial<CreatableInstances[T]>
	: never;

export interface ElementOf<T extends Roact.AnyComponent> extends Roact.Element {
	component: T;
	props: InferProps<T>;
}

/** @internal */
export const isArray = t.array(t.any);

export type WritablePropertiesOf<
	TInstance extends Instance,
	TExcludeProps extends keyof TInstance = keyof Instance,
> = WritableProperties<ExcludeMembers<Omit<TInstance, TExcludeProps>, symbol>>;
