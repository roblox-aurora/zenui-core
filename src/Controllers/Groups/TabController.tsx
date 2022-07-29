import Roact from "@rbxts/roact";
import { View } from "../../Views/View";

export type InferTabProps<T> = T extends (props: infer A) => Roact.Element ? A : never;

export interface TabControllerRenderRequest<P> {
	readonly TabItem: P;
	readonly IsActive: boolean;
	readonly TabClickDelegate: () => void;
}

export interface TabControllerRenderContainerRequests<TTabViewComponent extends ComponentLike> {
	readonly Tabs: Roact.Children;
	readonly Other: Roact.Children;
	readonly Props: TabControllerProps<TTabViewComponent>;
}

type ComponentLike = Roact.FunctionComponent<any> | Roact.Component<any, any>;

interface TabControllerDefaultProps<TTabViewComponent extends ComponentLike> {}

export interface TabControllerProps<TTabViewComponent extends ComponentLike>
	extends TabControllerDefaultProps<TTabViewComponent> {
	Size?: UDim2;
	Position?: UDim2;
	TabDirection: Roact.InferEnumNames<Enum.FillDirection>;
	TabPadding?: UDim;
	/**
	 * Your tab component type - the props of that component will be passed to the tab container render function (to handle rendering)
	 */
	TabComponent: TTabViewComponent;
	SelectedTabIndex: number;
	/**
	 * Will pass each tab component's (specified in `TabComponent`) props - in which you can use to render the tab.
	 */
	RenderTabItem: (req: TabControllerRenderRequest<InferTabProps<TTabViewComponent>>) => Roact.Element;
	/**
	 * Handle the tab being clicked - This is invoked by the `TabClickedDelegate` in {@link TabControllerRenderRequest} that's passed to `RenderTabItem`
	 */
	OnTabClicked: (clickedTabIndex: number, clickedTabProps: InferTabProps<TTabViewComponent>) => void;

	/**
	 * Custom renderer for the tab container - will give all elements provided + the props provided to the renderer
	 */
	RenderTabContainer?: (req: TabControllerRenderContainerRequests<TTabViewComponent>) => Roact.Element;
}

/**
 * ### ZenUI::TabController
 *
 * A controller which renders tabs based on the children given.
 */
export class TabController<TTabViewComponent extends ComponentLike> extends Roact.PureComponent<
	TabControllerProps<TTabViewComponent>
> {
	public render() {
		const elements = new Map<string | number, Roact.Element>();

		const children = this.props[Roact.Children];
		if (!children || children.size() === 0) {
			return undefined;
		}

		let tabIndex = 0;
		for (const [key, child] of children) {
			// If tab view, we'll render as a tab
			if (child.component === this.props.TabComponent) {
				const currTabIndex = tabIndex;
				elements.set(
					key,
					this.props.RenderTabItem({
						TabItem: child.props as InferTabProps<TTabViewComponent>,
						TabClickDelegate: () =>
							this.props.OnTabClicked(currTabIndex, child.props as InferTabProps<TTabViewComponent>),
						IsActive: this.props.SelectedTabIndex === tabIndex,
					}),
				);
				children.delete(key);
				tabIndex++;
			}
		}

		if (this.props.RenderTabContainer) {
			return this.props.RenderTabContainer({
				Other: children,
				Tabs: elements,
				Props: this.props,
			});
		} else {
			return (
				<View Size={this.props.Size} Position={this.props.Position}>
					<uilistlayout Padding={this.props.TabPadding} FillDirection={this.props.TabDirection} />
					{children}
					{elements}
				</View>
			);
		}
	}
}
