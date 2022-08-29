import Roact from "@rbxts/roact";
import { InferEnumNames } from "../Utility/Types";
import { View } from "../Views/View";

export type InferTabProps<T> = T extends (props: infer A) => Roact.Element ? A : never;

export interface TabControllerRenderRequest<P> {
	/**
	 * The properties for this tab item
	 */
	readonly TabItem: P;

	/**
	 * Whether or not this particular tab is considered active
	 */
	readonly IsActive: boolean;
	/**
	 * A function that invokes the tab click inside the tab controller
	 */
	readonly TabClickDelegate: () => void;
}

export interface TabControllerRenderContainerRequests<TTabViewComponent extends ComponentLike> {
	/**
	 * The tab components passed into the tab controller
	 */
	readonly Tabs: Roact.Children;

	/**
	 * Other components passed into the tab controller that aren't tabs
	 */
	readonly Other: Roact.Children;

	/**
	 * The props for the tab controller itself
	 */
	readonly Props: TabControllerProps<TTabViewComponent>;
}

type ComponentLike = Roact.FunctionComponent<any> | Roact.Component<any, any>;

interface TabControllerDefaultProps<TTabViewComponent extends ComponentLike> {}

export interface TabControllerProps<TTabViewComponent extends ComponentLike>
	extends TabControllerDefaultProps<TTabViewComponent> {
	/**
	 * The size of the tab controller
	 */
	readonly Size?: UDim2;

	/**
	 * The position of the tab controller
	 */
	readonly Position?: UDim2;

	/**
	 * The direction the tabs are laid out in the tab controller
	 */
	readonly TabDirection: InferEnumNames<Enum.FillDirection>;

	/**
	 * The padding around the tabs
	 */
	readonly TabPadding?: UDim;

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
